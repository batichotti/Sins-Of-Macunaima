import { DistanceMethod, Pathfinding, PathNode } from "../components/phaser-pathfinding";
import { BaseScene } from "../core/BaseScene";
import { IMelee, IEnemy } from "../types";

export default class Enemy extends Phaser.Physics.Arcade.Sprite implements IEnemy {
    name: string;
    scene: BaseScene;
    spriteKey: string;
    spawnRegion = 'Não importa aqui. Apenas para EnemyManager';
    weapon: IMelee;
    baseHealth: number;
    baseSpeed: number;
    pathFinder!: Pathfinding;
    private path: Phaser.Math.Vector2[] = [];
    private nextNode = 0;
    private lastTileTarget = new Phaser.Math.Vector2(0, 0);

    constructor(scene: BaseScene, position: Phaser.Math.Vector2, spriteKey: string) {
        super(scene, position.x, position.y, spriteKey);
        this.spriteKey = spriteKey;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setBodySize(16, 32);
        /**
         * Por algum motivo o corpo do inimigo fica deslocado e é necessário fazer isso.
         */
        this.setOffset(0, 0);
        
        this.setScale(1.5).setCollideWorldBounds(true).setDepth(100);
    }

    private getCacheKey(targetTile: Phaser.Math.Vector2): string {
        const startTile = this.scene.map.worldToTileXY(this.x, this.y)!;
        return this.scene.enemyManager.pathCache.generateKey(startTile, targetTile, 12);
    }

    public setPathFinder(pf: Pathfinding) {
        this.pathFinder = pf;
    }

    configureEnemy(config: IEnemy) {
        this.setTexture(config.spriteKey);
        this.name = config.name;
        this.spriteKey = config.spriteKey;
        this.weapon = config.weapon;
        this.baseHealth = config.baseHealth;
        this.baseSpeed = config.baseSpeed;
    }

    private canPath(targetPosition: Phaser.Math.Vector2) {
        const targetTile = this.scene.map.worldToTileXY(targetPosition.x, targetPosition.y)!;
        const targetMoved = !targetTile.equals(this.lastTileTarget);
        const reachedEndOfPath = this.nextNode >= this.path.length - 1;
        return targetMoved || reachedEndOfPath;
    }

    private simplifyPath(path: Phaser.Math.Vector2[]): Phaser.Math.Vector2[] {
        if (path.length <= 2) return path;
        
        const result: Phaser.Math.Vector2[] = [path[0]];
        
        for (let i = 1; i < path.length - 1; i++) {
            const prev = path[i-1];
            const current = path[i];
            const next = path[i+1];
            
            const dx1 = current.x - prev.x;
            const dy1 = current.y - prev.y;
            const dx2 = next.x - current.x;
            const dy2 = next.y - current.y;
            
            if (Math.abs(Math.atan2(dy1, dx1) - Math.atan2(dy2, dx2)) > 0.1) {
                result.push(current);
            }
        }
    
        result.push(path[path.length - 1]);
        return result;
    }


    private calculatePartialPath(targetPx: Phaser.Math.Vector2) {
        const direction = new Phaser.Math.Vector2(targetPx.x - this.x, targetPx.y - this.y).normalize();
        
        const intermediateDistance = 350;
        const intermediatePx = new Phaser.Math.Vector2(
            this.x + direction.x * intermediateDistance,
            this.y + direction.y * intermediateDistance
        );
        
        const intermediateTile = this.scene.map.worldToTileXY(intermediatePx.x, intermediatePx.y);
        let walkableTile = intermediateTile;
        
        if(!intermediateTile) return;

        if (!this.scene.enemyManager.grid.getNode(intermediateTile.x, intermediateTile.y)?.walkable) {
            walkableTile = this.findNearestWalkableTile(intermediateTile);
        }
        
        if(!walkableTile) return;

        const startTile = this.scene.map.worldToTileXY(this.x, this.y);
        const raw = this.pathFinder.findPathBetweenTl(startTile!, walkableTile, { distanceMethod: DistanceMethod.Octile, diagonal: true, simplify: true });
        
        this.path = raw.map(n => this.scene.map.tileToWorldXY(n.tileX, n.tileY)!.add(new Phaser.Math.Vector2(this.scene.map.tileWidth/2, this.scene.map.tileWidth/2)));
        
        this.nextNode = 0;
        this.lastTileTarget = walkableTile.clone();
    }

    private findNearestWalkableTile(tile: Phaser.Math.Vector2): Phaser.Math.Vector2 {
        const searchRadius = 10;
        
        for (let r = 1; r <= searchRadius; r++) {
            for (let dx = -r; dx <= r; dx++) {
                for (let dy = -r; dy <= r; dy++) {
                    if (Math.abs(dx) < r && Math.abs(dy) < r) continue;
                    
                    const checkX = tile.x + dx;
                    const checkY = tile.y + dy;

                    if (this.scene.enemyManager.grid.getNode(checkX, checkY)?.walkable) {
                        return new Phaser.Math.Vector2(checkX, checkY);
                    }
                }
            }
        }
        return tile.clone();
    }

    updatePathing(targetPx: Phaser.Math.Vector2) {
        if (!this.body || !this.pathFinder) return;

        if(!this.canPath(targetPx)) {
            return;
        }

        const cacheKey = this.getCacheKey(targetPx);
        const cachedPath = this.scene.enemyManager.pathCache.get(cacheKey) ?? [];

        const targetTile = this.scene.map.worldToTileXY(targetPx.x, targetPx.y);

        if(this.scene.enemyManager.pathCache.isValid(cacheKey) && cachedPath.length > 0) {
            this.path = cachedPath;
            this.nextNode = 0;
            this.lastTileTarget = targetTile!.clone();
            return;
        }

        const startTile = this.scene.map.worldToTileXY(this.x, this.y);

        const raw = this.pathFinder.findPathBetweenTl(startTile!, targetTile!, { distanceMethod: DistanceMethod.Octile, diagonal: true, simplify: true }).map(n => this.scene.map.tileToWorldXY(n.tileX, n.tileY)!.add(new Phaser.Math.Vector2(this.scene.map.tileWidth/2, this.scene.map.tileWidth/2)));

        this.path = this.simplifyPath(raw);
        this.scene.enemyManager.pathCache.set(cacheKey, this.path);
        this.nextNode = 0;
        this.lastTileTarget = targetTile!.clone();
    }

    updateMovement() {
        if (this.nextNode >= this.path.length) {
            this.setVelocity(0, 0);
            return;
        }

        const dest = this.path[this.nextNode];
        const dir  = new Phaser.Math.Vector2(dest.x - this.x, dest.y - this.y).normalize();

        let speed = this.baseSpeed;
        

        const nextX = this.x + (dir.x * speed * 0.032);
        const nextY = this.y + (dir.y * speed * 0.032);
        const nextTile = this.scene.map.worldToTileXY(nextX, nextY);
        
        if (nextTile && !this.scene.enemyManager.grid.getNode(nextTile.x, nextTile.y)?.walkable) {
            this.setVelocity(0, 0);
            this.nextNode = this.path.length;
            return;
        }

        this.setVelocity(dir.x * speed, dir.y * speed);

        if (Phaser.Math.Distance.Between(this.x, this.y, dest.x, dest.y) < 8) this.nextNode++;
    }

    private destroyEnemy(): void {
        this.setActive(false).setVisible(false);
    }
}