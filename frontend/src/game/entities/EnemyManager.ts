import Enemy from "./Enemy";
import { BossTypes, EnemyTypes } from "../types";
import { BaseScene } from "../core/BaseScene";
import { Pathfinding } from "../components/phaser-pathfinding";
import { Grid } from "../components/phaser-pathfinding";
import PathCache from "../core/PathCache";
import { Character } from "./Player";
import EnemySpawner from "./EnemySpawner";
import { EventManager } from "../core/EventBus";
import { GameEvents } from "../types";
import { WaypointNode } from "../types";

export default class EnemyManager {
    enemySpawner: EnemySpawner;
    enemyPool: Phaser.Physics.Arcade.Group;
    scene: BaseScene;
    pathFinder: Pathfinding;
    pathCache = new PathCache(7000);
    waypointGraph: Map<string, Phaser.Math.Vector2[]> = new Map();
    maxEnemyDistance: number = 200;
    canPath: boolean = true;
    canSpawn: boolean = true;
    grid: Grid;
    playerPos = new Phaser.Math.Vector2();
    updateIndex = 0;
    waypoints: Phaser.Math.Vector2[] = [];
    maxDirectDistance: number = 300;
    cooldownAttack: boolean = true;
    bossSpawned: boolean = false;

    constructor(scene: BaseScene) {
        this.scene = scene;
        this.enemySpawner = new EnemySpawner(scene);
        const blockers = this.scene.map.getLayer('colisao')!.tilemapLayer;
        this.grid = Grid.createFromMap(this.scene.map, [blockers]);
        this.pathFinder = new Pathfinding(this.grid);
        this.enemyPool = scene.physics.add.group({
            classType: Enemy,
            maxSize: 40,
            collideWorldBounds: true,
            runChildUpdate: true,
            createCallback: (enemyObj: Phaser.GameObjects.GameObject) => {
                const enemy = enemyObj as Enemy;
                enemy.setActive(true).setVisible(true).setCollideWorldBounds(true);
                enemy.setPathFinder(this.pathFinder);
            }
        });
        this.scene.physics.add.collider(blockers, this.enemyPool, this.unblockEnemy);
        this.scene.physics.add.overlap(this.scene.player.character, this.enemyPool, this.attack);

        EventManager.Instance.on(GameEvents.SHOULD_SPAWN_BOSS, () => { this.bossSpawned = true });

        this.loadWaypoints();
    }

    private loadWaypoints(): void {
        const waypointLayer = this.scene.map.getObjectLayer('waypoints');
        if (!waypointLayer) return;

        waypointLayer.objects.forEach(obj => {
            if (obj.type === 'waypoint') {
                const wp = new Phaser.Math.Vector2(
                    obj.x! + (obj.width! / 2),
                    obj.y! - (obj.height! / 2)
                );
                this.waypoints.push(wp);
            }
        });

        this.buildWaypointGraph();
    }

    public getTargetPosition(enemyPos: Phaser.Math.Vector2, playerPos: Phaser.Math.Vector2): Phaser.Math.Vector2 {
        const distanceToPlayer = Phaser.Math.Distance.Between(
            enemyPos.x,
            enemyPos.y,
            playerPos.x,
            playerPos.y
        );

        if (distanceToPlayer <= this.maxDirectDistance) {
            return playerPos.clone();
        }

        const nearestWaypoint = this.findNearestWaypoint(enemyPos);

        return nearestWaypoint ? nearestWaypoint.clone() : playerPos.clone();
    }

    private getTilesAlongLine(start: Phaser.Math.Vector2, end: Phaser.Math.Vector2): Phaser.Tilemaps.Tile[] {
        const tiles: Phaser.Tilemaps.Tile[] = [];
        const tilemap = this.scene.map;

        let x0 = tilemap.worldToTileX(start.x)!;
        let y0 = tilemap.worldToTileY(start.y)!;
        const x1 = tilemap.worldToTileX(end.x)!;
        const y1 = tilemap.worldToTileY(end.y)!;

        const dx = Math.abs(x1 - x0);
        const dy = -Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx + dy;

        while (true) {
            const tile = tilemap.getTileAt(x0, y0);
            if (tile) tiles.push(tile);

            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 >= dy) {
                err += dy;
                x0 += sx;
            }
            if (e2 <= dx) {
                err += dx;
                y0 += sy;
            }
        }
        return tiles;
    }

    private buildWaypointGraph(): void {
        const CONNECTION_RADIUS = 600;

        this.waypoints.forEach(wp => {
            const neighbors = this.waypoints.filter(other => {
                if (wp.equals(other)) return false;

                if (Phaser.Math.Distance.Between(wp.x, wp.y, other.x, other.y) > CONNECTION_RADIUS) return false;

                const tiles = this.getTilesAlongLine(wp, other);
                return tiles.every(tile => this.grid.getNode(tile.x, tile.y)?.walkable);
            });

            this.waypointGraph.set(`${wp.x},${wp.y}`, neighbors);
        });
    }

    public findPathViaWaypoints(start: Phaser.Math.Vector2, end: Phaser.Math.Vector2): Phaser.Math.Vector2[] {
        const startWp = this.findNearestWaypoint(start);
        const endWp = this.findNearestWaypoint(end);
        if (!startWp || !endWp) return [end];

        const openSet: WaypointNode[] = [];
        const allNodes = new Map<string, WaypointNode>();

        // Inicializa A*
        const startNode: WaypointNode = {
            point: startWp,
            g: 0,
            h: Phaser.Math.Distance.Between(startWp.x, startWp.y, endWp.x, endWp.y),
            f: 0,
            parent: null
        };
        startNode.f = startNode.g + startNode.h;
        openSet.push(startNode);
        allNodes.set(`${startWp.x},${startWp.y}`, startNode);

        while (openSet.length > 0) {
            openSet.sort((a, b) => a.f - b.f);
            const current = openSet.shift()!;

            if (current.point.equals(endWp)) {
                return this.reconstructPath(current);
            }

            const neighbors = this.waypointGraph.get(`${current.point.x},${current.point.y}`) || [];
            for (const neighborPoint of neighbors) {
                const tentativeG = current.g + Phaser.Math.Distance.Between(
                    current.point.x, current.point.y,
                    neighborPoint.x, neighborPoint.y
                );

                const existing = allNodes.get(`${neighborPoint.x},${neighborPoint.y}`);
                if (!existing || tentativeG < existing.g) {
                    const newNode: WaypointNode = {
                        point: neighborPoint,
                        g: tentativeG,
                        h: Phaser.Math.Distance.Between(neighborPoint.x, neighborPoint.y, endWp.x, endWp.y),
                        f: tentativeG + Phaser.Math.Distance.Between(neighborPoint.x, neighborPoint.y, endWp.x, endWp.y),
                        parent: current
                    };

                    if (!existing) {
                        openSet.push(newNode);
                        allNodes.set(`${neighborPoint.x},${neighborPoint.y}`, newNode);
                    } else {
                        existing.g = tentativeG;
                        existing.f = tentativeG + existing.h;
                        existing.parent = current;
                    }
                }
            }
        }

        return [endWp];
    }

    private reconstructPath(node: WaypointNode): Phaser.Math.Vector2[] {
        const path: Phaser.Math.Vector2[] = [];
        let current: WaypointNode | null = node;

        while (current) {
            path.unshift(current.point);
            current = current.parent;
        }
        return path;
    }

    public findNearestWaypoint(position: Phaser.Math.Vector2): Phaser.Math.Vector2 | null {
        if (this.waypoints.length === 0) return null;

        return this.waypoints.reduce((prev, curr) =>
            Phaser.Math.Distance.Between(position.x, position.y, curr.x, curr.y) <
            Phaser.Math.Distance.Between(position.x, position.y, prev.x, prev.y) ? curr : prev
        );
    }

    private attack = (obj1: object, obj2: object) => {
        const enemy = obj2 as Enemy;
        const character = obj1 as Character;

        if (!enemy.active || !enemy.weapon?.baseDamage) return;

        if(this.cooldownAttack) {
            character.takeDamage(enemy.weapon.baseDamage * enemy.damageMultiplier);
            this.cooldownAttack = false;
            this.scene.time.delayedCall(750, () => { this.cooldownAttack = true; });
        }
    };

    private unblockEnemy = (obj1: object) => {
        if(obj1 instanceof Enemy) {
            const vel = obj1.body?.velocity;
            const coords = { x: 0, y: 0 };
            if(vel!.x > 0) coords.x = -1;
            if(vel!.x < 0) coords.x = 1;
            if(vel!.y > 0) coords.y = -1;
            if(vel!.y < 0) coords.y = 1;

            obj1.setVelocity( vel!.x * coords.x * 0.8,  vel!.y * coords.y * 0.8);
        }
    };


    spawnEnemy() {
        const spawn = this.enemySpawner.chooseSpawn();
        if (!spawn || !this.canSpawn) return;

        if (!this.bossSpawned) {
            const validEnemies = Object.values(EnemyTypes).filter(e => e.spawnRegion === spawn.name);
            if (validEnemies.length === 0) return;

            const enemyType = Phaser.Utils.Array.GetRandom(validEnemies);
            const enemy = this.enemyPool.get(spawn.position.x, spawn.position.y, enemyType.spriteKey) as Enemy;

            if (enemy) {
                this.canSpawn = false;
                enemy.configureEnemy(enemyType);
                enemy.enableBody(true, spawn.position.x, spawn.position.y, true, true);
                this.scene.gameCameras.ui.ignore(enemy);
                this.scene.time.delayedCall(1250, () => this.canSpawn = true);
            }
        } else {
            const validBosses = Object.values(BossTypes).filter(e => e.spawnRegion === spawn.name);
            if (validBosses.length === 0) return;

            const bossType = Phaser.Utils.Array.GetRandom(validBosses);
            const boss = this.enemyPool.get(spawn.position.x, spawn.position.y, bossType.spriteKey) as Enemy;

            if (boss) {
                boss.configureEnemy(bossType);
                boss.isBoss = true;
                boss.enableBody(true, spawn.position.x, spawn.position.y, true, true);
                this.scene.gameCameras.ui.ignore(boss);
                this.canSpawn = false;
                EventManager.Instance.emit(GameEvents.BOSS_SPAWNED, bossType);
            }
        }
    }

    findNearestEnemy(): Phaser.Math.Vector2 | null {
        const children = this.enemyPool.getChildren();
        if (children.length <= 0) return null;

        const playerPos = this.scene.player.character.body?.position;
        if (!playerPos) return null;

        let nearestDistance = Number.MAX_VALUE;
        let nearestPosition: Phaser.Math.Vector2 | null = null;

        for (const child of children) {
            const enemy = child as Enemy;
            if (!enemy.active || !enemy.body) continue;

            const distance = Phaser.Math.Distance.Between(
                playerPos.x,
                playerPos.y,
                enemy.body.position.x,
                enemy.body.position.y
            );

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestPosition = new Phaser.Math.Vector2(
                    enemy.body.position.x - playerPos.x,
                    enemy.body.position.y - playerPos.y
                );
            }
        }

        return nearestDistance < this.maxEnemyDistance ? nearestPosition : null;
    }

    updatePathing() {
        if (!this.canPath) return;

        this.canPath = false;
        const enemies = this.enemyPool.getChildren() as Enemy[];
        this.playerPos.set(this.scene.player.character.x, this.scene.player.character.y);

        const BATCH_SIZE = Math.ceil(enemies.length / 4);
        let processed = 0;
        let index = this.updateIndex;

        while (processed < BATCH_SIZE && enemies.length > 0) {
            if (index >= enemies.length) index = 0;

            const enemy = enemies[index];
            if (enemy?.active && enemy.body) {
                enemy.updatePathing(this.playerPos);
                processed++;
            }

            index++;
            this.updateIndex = index % enemies.length;

            if (index === this.updateIndex) break;
        }
        this.scene.time.delayedCall(100, () => this.canPath = true);
    }

    updateMovement() {
        const enemies = this.enemyPool.getChildren() as Enemy[];
        for(let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if(enemy.active) enemy.updateMovement();
        }
    }

    resetAllEnemies(): void {
        this.enemyPool.clear(true, true);
    }

    destroy(): void {
      this.enemyPool.destroy();
    }
}
