import Enemy from "./Enemy";
import { EnemyTypes } from "../types";
import { BaseScene } from "../core/BaseScene";
import { Pathfinding } from "../components/phaser-pathfinding";
import { Grid } from "../components/phaser-pathfinding";
import PathCache from "../core/PathCache";

export default class EnemyManager {
    enemyPool: Phaser.Physics.Arcade.Group;
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
        this.enemyPool = scene.physics.add.group({
            classType: Enemy,
            maxSize: 20,
            collideWorldBounds: true,
            runChildUpdate: false,
            createCallback: (enemyObj: Phaser.GameObjects.GameObject) => {
                const enemy = enemyObj as Enemy;
                enemy.setActive(true).setVisible(true).setCollideWorldBounds(true);
                enemy.setPathFinder(this.pathFinder);
            }
        });
        this.scene.physics.add.collider(this.enemyPool, this.enemyPool);
        this.scene.physics.add.collider(blockers, this.enemyPool);
        this.scene.physics.add.collider(this.scene.player.character, this.enemyPool);
    }

    spawnEnemy(region: string, position: Phaser.Math.Vector2) {
        if(this.canSpawn) {
            const validEnemies = EnemyTypes.filter(e => e.spawnRegion === region);
            if (validEnemies.length === 0) return;

            const enemyType = Phaser.Utils.Array.GetRandom(validEnemies);
            const enemy = this.enemyPool.get(position.x, position.y, enemyType.spriteKey) as Enemy;
            if(enemy) {
                console.log("Inimigoo");
                this.canSpawn = false;
                enemy.setPosition(position.x, position.y)
                enemy.configureEnemy(enemyType);
                this.scene.gameCameras.ui.ignore(enemy);
            }
        }
        this.scene.time.delayedCall(1000, () => this.canSpawn = true);
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

            const baseDelay = 100;
        const enemyCountFactor = enemies.length * 2;
        const delay = Math.min(500, baseDelay + enemyCountFactor);
        this.scene.time.delayedCall(delay, () => this.canPath = true);
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