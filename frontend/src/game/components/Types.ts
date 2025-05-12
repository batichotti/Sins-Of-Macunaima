export interface IShootingKeys {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
}

export interface SceneData {
    targetScene: string;
    previousScene: string;
    playerData: PlayerData;
}

export interface AnimatedTileData {
    tile: Phaser.Tilemaps.Tile,
    animationFrames: { tileid: number; duration: number }[],
    firstgid: number,
    elapsedTime: number
}

export interface Weapon {
    key: string;
    baseDamage: number;
    baseCoolDown: number;
    baseSpeed: number;
}

export interface Level {
    level: number;
    cooldownDecrease: number;
    speedIncrease: number;
    healthIncrease: number;
    damageIncrease: number;
    defenseIncrease: number;
}

export interface PlayerData {
    name: string; // Nome do jogador
    characterKey: string; // Nome do personagem usado (Ex: Peri)
    level: Level;
    weapon: Weapon;
}