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
    pointGain: number;
    pathFinder!: Pathfinding;
    private path: Phaser.Math.Vector2[] = [];
    private nextNode = 0;
    private lastTileTarget = new Phaser.Math.Vector2(0, 0);
    private randomPivot: number = 0;

    constructor(scene: BaseScene, position: Phaser.Math.Vector2, spriteKey: string) {
        super(scene, position.x, position.y, spriteKey);
        this.randomPivot = Phaser.Utils.Array.GetRandom([ -3, -4, -5, -6, -7, -8, 3, 4, 5, 6, 7, 8 ]);
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
        return this.scene.enemyManager.pathCache.generateKey(startTile, targetTile, 3);
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
        this.pointGain = config.pointGain;
    }

    private canPath(position: Phaser.Math.Vector2) {
        const currentTile = this.scene.map.worldToTileXY(this.x, this.y)!;
        return !currentTile.equals(this.lastTileTarget) || this.nextNode >= this.path.length;
    }

    updatePathing(targetPx: Phaser.Math.Vector2) {
        if (!this.body || !this.pathFinder) return;

        if(!this.canPath(targetPx) || Phaser.Math.Distance.BetweenPoints({ x: this.x, y: this.y } as Phaser.Math.Vector2, targetPx) < 64) {
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

        const raw = this.pathFinder.findPathBetweenTl(startTile!, targetTile!, { distanceMethod: DistanceMethod.Octile, diagonal: true, simplify: true });

        this.path = raw.map(n => this.scene.map.tileToWorldXY(n.tileX, n.tileY)!.add(new Phaser.Math.Vector2(this.scene.map.tileWidth/2, this.scene.map.tileWidth/2)));
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
        const dir  = new Phaser.Math.Vector2(dest.x - this.x + this.randomPivot, dest.y - this.y - this.randomPivot).normalize();

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

    die(): void {
        this.destroy();
        //this.setActive(false).setVisible(false);   
    }
}