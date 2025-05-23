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
};