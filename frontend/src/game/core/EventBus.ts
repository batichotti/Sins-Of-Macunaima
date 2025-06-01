import { Events } from 'phaser';

/**
 * Usado para emitir eventos entre componentes React e cenas Phaser.
 * 
 * Ps: Já estava no template do Phaser + NextJs. Logo melhor não mexer.
 */
export const EventBus = new Events.EventEmitter();


/**
 * Usado para coordenar eventos do jogo.
 */
export enum GameEvents {
    ENEMY_DIED = 'enemyDied',
    LEVEL_UP = 'levelUp',
    HEALTH_CHANGE = 'healthChange',
    TOGGLE_WEAPON = 'toggleWeapon',
    WEAPON_COOLDOWN = 'weaponCooldown',
    PLAYER_DIED = 'playerDied',
    POINT_CHANGE = 'pointChange',
    TOGGLE_ATTACK_MODE = 'tooggleAttackMode',
    TOGGLE_ATTACK_MODE_SUCCEDED = 'toggleAttackModeSucceded',
    SHOULD_SPAWN_BOSS = 'shouldSpawnBoss',
    BOSS_SPAWNED = 'bossSpawned',
    BOSS_DEFEATED = 'bossDefeated'
}

/**
 * Classe singleton que coordena eventos entre classes.
 * 
 * Não me pergunte como isso funciona porque isso não importa :).
 */
export class EventManager {
    private static instance: EventManager;
    private emitter: Phaser.Events.EventEmitter;

    private constructor() {
        this.emitter = new Phaser.Events.EventEmitter();
    }

    public static getInstance(): EventManager {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }
        return EventManager.instance;
    }

    // Métodos para emitir/ouvir eventos
    public emit(event: GameEvents, ...args: any[]): void {
        this.emitter.emit(event, ...args);
    }

    public on(event: GameEvents, callback: (...args: any[]) => void, context?: any): void {
        this.emitter.on(event, callback, context);
    }

    public off(event: GameEvents, callback?: (...args: any[]) => void, context?: any): void {
        this.emitter.off(event, callback, context);
    }
}