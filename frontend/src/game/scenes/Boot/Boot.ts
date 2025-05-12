import { Scene } from 'phaser';
import { TilePaths, TileSets } from '@/game/components/configs/PathTiles';
import { WindowResolution } from '@/game/components/configs/Properties';
import { SceneData, PlayerData, Level, Weapon } from '@/game/components/Types';

export class Boot extends Scene {
    constructor () {
        super('Boot');
    }

    preload () {
        //  Especifica caminho base dos assets.
        this.load.setPath('assets');

        //  Jogador
        this.load.spritesheet('Macunaima', 'Characters/Macunaima/Sprite/Macunaima Idle Front.png', { frameWidth: 17, frameHeight: 30 });
        // this.load.spritesheet('Macunaima', 'Characters/Macunaima/Sprite/Test/Macunaima SV Test.png', { frameWidth: 17, frameHeight: 30 });

        // Tiles
        TileSets.forEach((tile) => {
            this.load.image(`${tile}`, `tiles/${TilePaths.extruded}/${tile}.png`);
        });

        this.load.image('arrow_sprite', 'Attacks/Projectiles/Arrows/arrow_sprite.png');
    }


    init() {
        // Valores base
        const outlineWidth = WindowResolution.width * 0.65;
        const outlineHeight = WindowResolution.height * 0.04;
        const maxBarWidth = outlineWidth - 2;
    
        // Moldura centralizada
        this.add.rectangle(
            WindowResolution.width / 2,
            WindowResolution.height / 2,
            outlineWidth,
            outlineHeight
        ).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(
            (WindowResolution.width / 2) - (outlineWidth / 2) + 1,
            WindowResolution.height / 2,
            0,
            outlineHeight - 2,
            0xffffff
        ).setOrigin(0, 0.5);
    
        // Atualização de progresso
        this.load.on('progress', (progress: number) => {
            bar.width = maxBarWidth * progress;
        });
    }

    create () {
        const playerData = {
            name: 'Irineu',
            characterKey: 'Macunaima',
            level: { level: 1, cooldownDecrease: 0, speedIncrease: 0, healthIncrease: 0, damageIncrease: 0, defenseIncrease: 0 } as Level,
            weapon: { key: 'arrow_sprite', baseDamage: 200, baseCoolDown: 100, baseSpeed: 250 } as Weapon
        } as PlayerData;
        this.scene.start('Loader', { targetScene: 'Mapa', previousScene: this.constructor.name, playerData: playerData } as SceneData);
    }
}