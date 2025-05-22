import Enemy from "./Enemy";
import { EnemyTypes } from "../types";
import { BaseScene } from "../core/BaseScene";
import { Pathfinding } from "../components/phaser-pathfinding";
import { Grid } from "../components/phaser-pathfinding";
import PathCache from "../core/PathCache";

export default class EnemyManager {
    enemyPool: Set<Enemy> = new Set();
    scene: BaseScene;
    pathFinder: Pathfinding;
    pathCache = new PathCache(7000);
    canPath = true;
    canSpawn = true;
    grid: Grid;
    private playerPos = new Phaser.Math.Vector2();
    private updateIndex = 0;

    constructor(scene: BaseScene) {
        this.scene = scene;
        const blockers = this.scene.map.getLayer('colisao')!.tilemapLayer;
        this.grid = Grid.createFromMap(this.scene.map, [blockers]);
        this.pathFinder = new Pathfinding(this.grid);
    }

    spawnEnemy(region: string, position: Phaser.Math.Vector2) {
        if(this.canSpawn) {
            const validEnemies = EnemyTypes.filter(e => e.spawnRegion === region);
            if (validEnemies.length === 0) return;

            const enemyType = Phaser.Utils.Array.GetRandom(validEnemies);
            const enemy = new Enemy(this.scene, position, enemyType.spriteKey);
            if(enemy) {
                console.log("Inimigoo");
                //this.canSpawn = false;
                enemy.setPosition(position.x, position.y)
                enemy.configureEnemy(enemyType);
                enemy.setPathFinder(this.pathFinder);
                this.enemyPool.add(enemy);
                this.scene.gameCameras.ui.ignore(enemy);
                //this.scene.time.delayedCall(10000, () => enemy.destroy());
            }
        }
        //this.scene.time.delayedCall(1000, () => this.canSpawn = true);
    }

    updatePathing() {
        if (!this.canPath) return;

        this.canPath = false;
        const enemies = this.enemyPool;
        this.playerPos.set(this.scene.player.character.x, this.scene.player.character.y);

        const BATCH_SIZE = Math.ceil(enemies.size / 4);
        let processed = 0;
        let currentIndex = 0;
        const startIndex = this.updateIndex;

        enemies.forEach((enemy) => {
            if (currentIndex < startIndex) {
                currentIndex++;
                return;
            }

            if (processed >= BATCH_SIZE) return;

            if (enemy?.active && enemy.body) {
                enemy.updatePathing(this.playerPos);
                processed++;
            }

            currentIndex++;
        });

        this.updateIndex = (startIndex + processed) % enemies.size;

        const baseDelay = 100;
        const enemyCountFactor = enemies.size * 2;
        const delay = Math.min(500, baseDelay + enemyCountFactor);
        this.scene.time.delayedCall(delay, () => this.canPath = true);
    }


    updateMovement() {
        const enemies = this.enemyPool;
        enemies.forEach(
            (enemy) => {
                if(enemy.active) enemy.updateMovement();
            }
        );
    }

    resetAllEnemies(): void {
        this.enemyPool.clear();
    }
}