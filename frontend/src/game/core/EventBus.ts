import { Events } from 'phaser';

/**
 * Usado para emitir eventos entre componentes React e cenas Phaser.
 */
export const EventBus = new Events.EventEmitter();