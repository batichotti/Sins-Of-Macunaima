import { BaseScene } from "../core/BaseScene";
import { EnemySpawnPoints } from "../types";

export default class EnemySpawner {
    private scene: BaseScene;
    private lastPlayerPos: Phaser.Math.Vector2;
    private spawnPoints: EnemySpawnPoints[] = [];
    private minDistance: number = 50;
    private maxDistance: number = 320;
    private canChoose: boolean = true;

    constructor(scene: BaseScene) {
        this.scene = scene;
        this.setupEnemySpawnPoints();
    }

    private setupEnemySpawnPoints(): void {
        const layer = this.scene.map.getObjectLayer('enemySpawnPoints')
        if(layer) layer.objects.forEach((obj) => { this.spawnPoints.push({ name: obj.name, position: new Phaser.Math.Vector2(obj.x! + obj.width!/2, obj.y! - obj.height!/2) }) })
    }

    chooseSpawn(): EnemySpawnPoints | null {
        if(this.canChoose) {
            this.canChoose = false;

            const playerPos = this.scene.player.character.body?.position ?? this.lastPlayerPos;
            if(playerPos) this.lastPlayerPos = playerPos;

            let nearest = Number.MAX_VALUE;
            let nearestPos = null;

            const spawnPoints = this.spawnPoints;

            for(let i = 0; i < spawnPoints.length; i++) {
                const temp = Phaser.Math.Distance.Between(playerPos!.x, playerPos!.y, spawnPoints[i].position.x, spawnPoints[i].position.y);
                if(nearest > temp && temp > this.minDistance) {
                    nearest = temp;
                    nearestPos = spawnPoints[i];
                }
            }

            this.scene.time.delayedCall(2000, () => { this.canChoose = true });
            return Phaser.Math.Distance.Between(nearestPos!.position.x, nearestPos!.position.y, playerPos!.x, playerPos!.y) < this.maxDistance ? nearestPos: null ;
        }
        return null;
    }
}
