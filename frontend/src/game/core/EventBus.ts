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
  /**
  * Inimigo morreu.
  */
  ENEMY_DIED = 'enemyDied',
  /**
  * Jogador subiu de nível.
  */
  LEVEL_UP = 'levelUp',
  /**
  * Jogador ganhou ou perdeu vida.
  */
  HEALTH_CHANGE = 'healthChange',
  /**
  * Jogador trocou de arma.
  */
  TOGGLE_WEAPON = 'toggleWeapon',
  /**
  * Cooldown da arma.
  */
  WEAPON_COOLDOWN = 'weaponCooldown',
  /**
  * Jogador morreu.
  */
  PLAYER_DIED = 'playerDied',
  /**
  * Jogador ganhou ou perdeu pontos.
  */
  POINT_CHANGE = 'pointChange',
  /**
  * Jogador trocou de modo de ataque.
  */
  TOGGLE_ATTACK_MODE = 'tooggleAttackMode',
  /**
  * O sistema conseguiu mudar o modo de ataque.
  */
  TOGGLE_ATTACK_MODE_SUCCEDED = 'toggleAttackModeSucceded',
  /**
  * O jogo deve spawnar um boss.
  */
  SHOULD_SPAWN_BOSS = 'shouldSpawnBoss',
  /**
  * Boss foi spawnado.
  */
  BOSS_SPAWNED = 'bossSpawned',
  /**
  * Boss foi derrotado.
  */
  BOSS_DEFEATED = 'bossDefeated',
  /**
  * Jogador trocou de personagem.
  */
  TOGGLE_CHARACTER = 'toggleCharacter',
  /**
  * Jogador trocou de personagem.
  */
  TOGGLE_CHARACTER_SUCCEDED = 'toggleCharacterSucceded'
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
