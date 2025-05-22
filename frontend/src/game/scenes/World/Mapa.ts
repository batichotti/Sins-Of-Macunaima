import { BaseScene } from '@/game/core/BaseScene';
import { SceneData } from '@/game/types';
import TextBox from '@/game/components/TextBox';
import EnemyManager from '@/game/entities/EnemyManager';

export class Mapa extends BaseScene {
    constructor() {
        super({ key: 'Mapa' });
    }

    init(data: SceneData): void {
        super.init(data);
    }

    create(): void {
        super.create();
    }
    update(time: number, delta: number): void {
        super.update(time, delta);
    }
}