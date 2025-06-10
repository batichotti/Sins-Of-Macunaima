import { BaseScene } from "../core/BaseScene";
import { EnemySpawnPoints } from "../types";

export default class EnemySpawner {
    private scene: BaseScene;
    private lastPlayerPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0); // Inicializar
    private spawnPoints: EnemySpawnPoints[] = [];
    private minDistance: number = 20;
    private maxDistance: number = 640;
    private canChoose: boolean = true;

    constructor(scene: BaseScene) {
        this.scene = scene;
        this.setupEnemySpawnPoints();
    }

    private setupEnemySpawnPoints(): void {
        const layer = this.scene.map.getObjectLayer('enemySpawnPoints');
        if (layer) {
            layer.objects.forEach((obj) => {
                if (obj.x !== undefined && obj.y !== undefined && obj.width !== undefined && obj.height !== undefined) {
                    this.spawnPoints.push({
                        name: obj.name || 'unnamed',
                        position: new Phaser.Math.Vector2(
                            obj.x + obj.width / 2,
                            obj.y - obj.height / 2
                        )
                    });
                }
            });
        }
    }

    chooseSpawn(): EnemySpawnPoints | null {
        if (!this.canChoose || this.spawnPoints.length === 0) {
            return null;
        }

        this.canChoose = false;
        const playerPos = this.scene.player.character.body?.position;

        if (playerPos) {
            this.lastPlayerPos.copy(playerPos);
        }

        let nearest = Number.MAX_VALUE;
        let nearestPos: EnemySpawnPoints | null = null;

        for (const spawnPoint of this.spawnPoints) {
            const distance = Phaser.Math.Distance.Between(
                this.lastPlayerPos.x,
                this.lastPlayerPos.y,
                spawnPoint.position.x,
                spawnPoint.position.y
            );

            if (distance > this.minDistance && distance < nearest) {
                nearest = distance;
                nearestPos = spawnPoint;
            }
        }

        this.scene.time.delayedCall(1250, () => {
            this.canChoose = true;
        });

        return nearestPos && nearest < this.maxDistance ? nearestPos : null;
    }
}
