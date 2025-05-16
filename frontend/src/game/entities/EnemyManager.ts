import Enemy from "./Enemy";
import { EnemyTypes } from "../types";
import { BaseScene } from "../core/BaseScene";

export default class EnemyManager {
    enemyPool: Phaser.Physics.Arcade.Group;
    scene: BaseScene;
    canAttack = true;

    constructor(scene: BaseScene) {
        this.scene = scene;
        this.enemyPool = scene.physics.add.group({
            classType: Enemy,
            maxSize: 40,
            runChildUpdate: true
        });
    }

    private randomEnemy() {
        return Phaser.Utils.Array.GetRandom(EnemyTypes);
    }

    spawnEnemy(position: Phaser.Math.Vector2) {
        const enemyType = this.randomEnemy();
        const enemy = this.enemyPool.get(position.x, position.y, enemyType.spriteKey);
        if(enemy) {
            enemy.configureEnemy(enemyType);
            enemy.setActive(true).setVisible(true).setCollideWorldBounds(true);
            this.scene.physics.world.enable(enemy);
            this.scene.gameCameras.ui.ignore(enemy);
        }
    }

    resetAllEnemies(): void {
        this.enemyPool.clear(true, true);
    }
}