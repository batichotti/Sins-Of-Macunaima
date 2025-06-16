import { Events } from 'phaser';
import {  GameEventsPayloads } from '../types';

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

    public emit<T extends keyof GameEventsPayloads>(event: T, payload: GameEventsPayloads[T]): void {
      this.emitter.emit(event, payload);
    }

    public on<T extends keyof GameEventsPayloads>(event: T, callback: (payload: GameEventsPayloads[T]) => void, context?: object): void {
      this.emitter.on(event as string, callback, context);
    }

    public off<T extends keyof GameEventsPayloads>(event: T, callback?: (data: GameEventsPayloads[T]) => void,context?: object): void {
      this.emitter.off(event as string, callback, context);
    }
}
