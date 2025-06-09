import { Events } from 'phaser';
import { GameEvents } from '../types';

/**
 * Usado para emitir eventos entre componentes React e cenas Phaser.
 *
 * Ps: Já estava no template do Phaser + NextJs. Logo melhor não mexer.
 */
export const EventBus = new Events.EventEmitter();

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

    public static get Instance(): EventManager {
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
