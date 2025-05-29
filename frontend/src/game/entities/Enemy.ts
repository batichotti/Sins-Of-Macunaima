import { DistanceMethod, Pathfinding, PathNode } from "../components/phaser-pathfinding";
import { BaseScene } from "../core/BaseScene";
import { IMelee, IEnemy, WeaponType, Directions } from "../types";
import TweenManager from "./TweenManager";

export default class Enemy extends Phaser.Physics.Arcade.Sprite implements IEnemy {
    // Propriedades básicas
    name: string;
    scene: BaseScene;
    spriteKey: string;
    spawnRegion = 'Não importa aqui. Apenas para EnemyManager';
    weapon: IMelee;
    baseHealth: number;
    damageMultiplier: number;
    baseSpeed: number;
    pointGain: number;
    
    // Sistema de pathfinding
    pathFinder!: Pathfinding;
    private path: Phaser.Math.Vector2[] = [];
    private nextNode = 0;
    private currentWaypointPath: Phaser.Math.Vector2[] = [];
    
    // Controle de estado
    private timeStuck: number = 0;
    private lastPos = new Phaser.Math.Vector2(0, 0);
    private lastTileTarget = new Phaser.Math.Vector2(0, 0);
    private randomPivot: number = 0;

    constructor(scene: BaseScene, position: Phaser.Math.Vector2, spriteKey: string) {
        super(scene, position.x, position.y, spriteKey);
        
        // Configuração inicial
        this.randomPivot = Phaser.Utils.Array.GetRandom([ -3, -4, -5, -6, -7, -8, 3, 4, 5, 6, 7, 8 ]);
        this.spriteKey = spriteKey;
        
        // Adiciona à cena e física
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Ajuste do corpo físico
        this.setBodySize(16, 32)
            .setOffset(0, 0)
            .setScale(1.5)
            .setCollideWorldBounds(true)
            .setDepth(100);
    }

    public setPathFinder(pf: Pathfinding): void {
        this.pathFinder = pf;
    }

    configureEnemy(config: IEnemy): void {
        // Configura propriedades do inimigo
        this.setTexture(config.spriteKey);
        this.name = config.name;
        this.spriteKey = config.spriteKey;
        this.damageMultiplier = config.damageMultiplier;
        this.weapon = config.weapon;
        this.baseHealth = config.baseHealth;
        this.baseSpeed = config.baseSpeed;
        this.pointGain = config.pointGain;
    }

    updatePathing(targetPx: Phaser.Math.Vector2): void {
        if (!this.body || !this.pathFinder) return;

        if (this.shouldRecalculatePath(targetPx)) {
            const targetPos = this.scene.enemyManager.getTargetPosition(
                new Phaser.Math.Vector2(this.x, this.y), 
                targetPx
            );
            
            this.calculatePath(targetPos);
            this.lastTileTarget = targetPx.clone();
        }
    }

    private shouldRecalculatePath(target: Phaser.Math.Vector2): boolean {
        return Phaser.Math.Distance.BetweenPoints(target, this.lastTileTarget) > this.scene.map.tileWidth * 3;
    }

    private calculatePath(target: Phaser.Math.Vector2): void {
        const directDistance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

        if (directDistance > this.scene.enemyManager.maxDirectDistance) {
            const waypointPath = this.scene.enemyManager.findPathViaWaypoints(
                new Phaser.Math.Vector2(this.x, this.y),
                target
            );
            
            this.path = this.convertWaypointPath(waypointPath);
            this.nextNode = 0;
            this.currentWaypointPath = waypointPath;
            return;
        }

        const startTile = this.scene.map.worldToTileXY(this.x, this.y);
        const targetTile = this.scene.map.worldToTileXY(target.x, target.y);
        const cacheKey = this.getCacheKey(targetTile!);
        const cachedPath = this.scene.enemyManager.pathCache.get(cacheKey) ?? [];

        if (this.scene.enemyManager.pathCache.isValid(cacheKey) && cachedPath.length > 0) {
            this.path = cachedPath;
            this.nextNode = 0;
            this.lastTileTarget = targetTile!.clone();
            return;
        }

        const raw = this.pathFinder.findPathBetweenTl(startTile!, targetTile!, { 
            distanceMethod: DistanceMethod.Octile,
            diagonal: true,
            simplify: true
        });

        this.path = raw.map(n => this.scene.map.tileToWorldXY(n.tileX, n.tileY)!.add(new Phaser.Math.Vector2(this.scene.map.tileWidth/2, this.scene.map.tileHeight/2)));
        
        this.scene.enemyManager.pathCache.set(cacheKey, this.path);
        this.nextNode = 0;
        this.lastTileTarget = targetTile!.clone();
    }

    private convertWaypointPath(waypoints: Phaser.Math.Vector2[]): Phaser.Math.Vector2[] {
        return waypoints.flatMap((wp, i) => {
            if (i === waypoints.length - 1) return [wp];
            
            const next = waypoints[i + 1];
            const steps = Math.ceil(Phaser.Math.Distance.Between(wp.x, wp.y, next.x, next.y) / 32);
            const points: Phaser.Math.Vector2[] = [];
            
            for (let j = 0; j <= steps; j++) {
                const t = j / steps;
                points.push(new Phaser.Math.Vector2(
                    Phaser.Math.Linear(wp.x, next.x, t),
                    Phaser.Math.Linear(wp.y, next.y, t)
                ));
            }
            return points;
        });
    }

    updateMovement(): void {
        const delta = this.scene.game.loop.delta;
        
        if (this.nextNode < this.path.length) {
            const nextTile = this.scene.map.worldToTileXY(
                this.path[this.nextNode].x,
                this.path[this.nextNode].y
            );
            
            if (!this.scene.enemyManager.grid.getNode(nextTile!.x, nextTile!.y)?.walkable) {
                this.path = [];
                this.nextNode = 0;
                return;
            }
        }

        if (this.nextNode >= this.path.length) {
            this.setVelocity(0, 0);
            
            if (this.currentWaypointPath.length > 0 && Phaser.Math.Distance.Between(this.x, this.y, this.currentWaypointPath.slice(-1)[0].x, this.currentWaypointPath.slice(-1)[0].y) < 50) {
                this.currentWaypointPath = [];
            }
            return;
        }

        const dest = this.path[this.nextNode];
        const dir = new Phaser.Math.Vector2(dest.x - this.x, dest.y - this.y).normalize();
        const speed = this.baseSpeed;

        this.walkAnimation(dir);

        this.setVelocity(dir.x * speed, dir.y * speed);

        if (Phaser.Math.Distance.Between(this.x, this.y, dest.x, dest.y) < 32) {
            this.nextNode++;
        }

        if (Phaser.Math.Distance.Between(this.lastPos.x, this.lastPos.y, this.x, this.y) < 5) {
            this.timeStuck += delta;
            if (this.timeStuck >= 3000) {
                this.destroy();
            }
        } else {
            this.timeStuck = 0;
            this.lastPos.set(this.x, this.y);
        }
    }

    private walkAnimation(direction: Phaser.Math.Vector2) {
        if(direction.x > 0) this.play(`${this.spriteKey}_${Directions.RIGHT}`, true);
        else if(direction.x < 0) this.play(`${this.spriteKey}_${Directions.LEFT}`, true);
        else if(direction.y > 0) this.play(`${this.spriteKey}_${Directions.DOWN}`, true);
        else if(direction.y < 0) this.play(`${this.spriteKey}_${Directions.UP}`, true);
        else this.setFrame(0);
    }

    private getCacheKey(targetTile: Phaser.Math.Vector2): string {
        const startTile = this.scene.map.worldToTileXY(this.x, this.y)!;
        return this.scene.enemyManager.pathCache.generateKey(startTile, targetTile, 3);
    }

    takeDamage(damage: number): boolean {
        this.baseHealth -= damage;
        TweenManager.Instance.damageTween(this);

        if (this.baseHealth <= 0) {
            this.destroy();
            return true;
        }
        return false;
    }

    destroy(): void {
        this.disableBody(true, true);
        super.destroy();
    }
}