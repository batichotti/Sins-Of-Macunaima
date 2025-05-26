import Enemy from "./Enemy";
import { EnemyTypes } from "../types";
import { BaseScene } from "../core/BaseScene";
import { Pathfinding } from "../components/phaser-pathfinding";
import { Grid } from "../components/phaser-pathfinding";
import PathCache from "../core/PathCache";
import { Character } from "./Player";

export default class EnemyManager {
    enemyPool: Phaser.Physics.Arcade.Group;
    scene: BaseScene;
    pathFinder: Pathfinding;
    pathCache = new PathCache(7000);
    canPath = true;
    canSpawn = true;
    grid: Grid;
    playerPos = new Phaser.Math.Vector2();
    updateIndex = 0;
    waypoints: Phaser.Math.Vector2[] = [];
    maxDirectDistance: number = 200;
    cooldownAttack: boolean = true;


    constructor(scene: BaseScene) {
        this.scene = scene;
        const blockers = this.scene.map.getLayer('colisao')!.tilemapLayer;
        this.grid = Grid.createFromMap(this.scene.map, [blockers]);
        this.pathFinder = new Pathfinding(this.grid);
        this.enemyPool = scene.physics.add.group({
            classType: Enemy,
            maxSize: 10,
            collideWorldBounds: true,
            runChildUpdate: true,
            createCallback: (enemyObj: Phaser.GameObjects.GameObject) => {
                const enemy = enemyObj as Enemy;
                enemy.setActive(true).setVisible(true).setCollideWorldBounds(true);
                enemy.setPathFinder(this.pathFinder);
            }
        });
        this.scene.physics.add.collider(blockers, this.enemyPool);
        this.scene.physics.add.overlap(this.scene.player.character, this.enemyPool, this.attack);

        this.loadWaypoints();
    }

    private loadWaypoints(): void {
        const objectLayers = this.scene.map.objects;
        
        objectLayers.forEach(layer => {
            layer.objects.forEach(obj => {
                if (obj.name === 'waypoint') {
                    this.waypoints.push(new Phaser.Math.Vector2(obj.x!, obj.y!));
                }
            });
        });
    }

    private findNearestWaypoint(position: Phaser.Math.Vector2): Phaser.Math.Vector2 | null {
        if (this.waypoints.length === 0) return null;

        let nearest = this.waypoints[0];
        let nearestDistance = Phaser.Math.Distance.Between(
            position.x, position.y, nearest.x, nearest.y
        );

        for (let i = 1; i < this.waypoints.length; i++) {
            const distance = Phaser.Math.Distance.Between(
                position.x, position.y, this.waypoints[i].x, this.waypoints[i].y
            );
            
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = this.waypoints[i];
            }
        }

        return nearest;
    }

    public getTargetPosition(enemyPos: Phaser.Math.Vector2, playerPos: Phaser.Math.Vector2): Phaser.Math.Vector2 {
        const distance = Phaser.Math.Distance.Between(
            enemyPos.x, enemyPos.y, playerPos.x, playerPos.y
        );

        if (distance <= this.maxDirectDistance) {
            return playerPos;
        }

        const nearestWaypoint = this.findNearestWaypoint(enemyPos);
        return nearestWaypoint || playerPos;
    }

    private attack = (obj1: object, obj2: object) => {
        const enemy = obj2 as Enemy;
        const character = obj1 as Character;

        if (!enemy.active || !enemy.weapon?.baseDamage) return;

        if(this.cooldownAttack) {
            character.takeDamage(enemy.weapon.baseDamage + character.maximumHealth / 20);
            this.cooldownAttack = false;
            this.scene.time.delayedCall(750, () => { this.cooldownAttack = true; });
        }
    };

    spawnEnemy(region: string, position: Phaser.Math.Vector2) {
        if(this.canSpawn) {
            const validEnemies = EnemyTypes.filter(e => e.spawnRegion === region);
            if (validEnemies.length === 0) return;

            const enemyType = Phaser.Utils.Array.GetRandom(validEnemies);
            const enemy = this.enemyPool.get(position.x, position.y, enemyType.spriteKey) as Enemy;
            if(enemy) {
                this.canSpawn = false;
                enemy.configureEnemy(enemyType);
                enemy.enableBody(true, position.x, position.y, true, true);
                this.scene.gameCameras.ui.ignore(enemy);
            }
        }
        this.scene.time.delayedCall(1250, () => this.canSpawn = true);
    }

    findNearestEnemy(): number | null {
        const children = this.enemyPool.getChildren();
        if(children.length <= 0) return null;

        const playerPos = this.scene.player.character.body!.position;

        let nearest = Phaser.Math.Distance.Between(playerPos.x, playerPos.x, children[0].body!.position.x, children[0].body!.position.y);
        let res = children[0].body!.position;

        for(let i = 1; i < children.length; i++) {
            const temp = children[i].body!.position;
            const distTemp = Phaser.Math.Distance.Between(playerPos.x, playerPos.y, temp.x, temp.y);
            if(distTemp < nearest) {
                nearest = distTemp;
                res = temp;
            }
        }

        return Phaser.Math.Angle.Between(playerPos.x, playerPos.y, res.x, res.y);
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
}