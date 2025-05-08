import Player from '@/game/entities/Player';

export interface IShootingKeys {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
}

export interface SceneData {
    targetScene: string;
    previousScene: string;
    player: Player;
}

export interface AnimatedTileData {
    tile: Phaser.Tilemaps.Tile,
    animationFrames: { tileid: number; duration: number }[],
    firstgid: number,
    elapsedTime: number
}