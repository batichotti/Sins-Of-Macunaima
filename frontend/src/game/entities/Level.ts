import { ILevel, levelModifers } from "../types";

export class Level implements ILevel {
    level!: number;
    cooldownDecrease!: number;
    speedIncrease!: number;
    healthIncrease!: number;
    damageIncrease!: number;
    defenseIncrease!: number;

    constructor(level: number) {
        this.level = level;
        this.cooldownDecrease = this.level * levelModifers.cooldown;
    }
};