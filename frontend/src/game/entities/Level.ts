import { EventManager, GameEvents } from "../core/EventBus";
import { ILevel, levelModifiers } from "../types";

export class Level implements ILevel {
    level!: number;
    cooldownDecrease = 1;
    speedIncrease = 1;
    healthIncrease = 1;
    damageIncrease = 1;
    defenseIncrease = 1;

    constructor(level: number) {
        this.level = level === 0 ? 1 : Math.abs(level);
        if(level > 1) {
            this.cooldownDecrease = level * levelModifiers.cooldown; 
            this.speedIncrease = level * levelModifiers.speed;
            this.healthIncrease = level * levelModifiers.health;
            this.damageIncrease = level * levelModifiers.damage;
            this.defenseIncrease = level * levelModifiers.defense;
        }
    }

    levelUp() {
        this.level += 1;
        this.cooldownDecrease += levelModifiers.cooldown; 
        this.speedIncrease += levelModifiers.speed;
        this.healthIncrease += levelModifiers.health;
        this.damageIncrease += levelModifiers.damage;
        this.defenseIncrease += levelModifiers.defense;
        EventManager.getInstance().emit(GameEvents.LEVEL_UP, { level: this.level });
    }
};