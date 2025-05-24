import { EventManager, GameEvents } from "../core/EventBus";
import { ILevel, levelModifiers } from "../types";

export class Level implements ILevel {
    level!: number;
    healthIncrease: number = 1;
    damageIncrease: number = 1;

    constructor(level: number) {
        this.level = level === 0 ? 1 : Math.abs(level);
        if(level > 1) {
            this.healthIncrease = level * levelModifiers.health;
            this.damageIncrease = level * levelModifiers.damage;
        }
    }

    levelUp() {
        this.level += 1;
        EventManager.getInstance().emit(GameEvents.LEVEL_UP, { level: this.level });
    }
};