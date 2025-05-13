import { IWeapon } from "../types";

export class Weapon implements IWeapon {
    name!: string;
    spriteKey!: string;
    baseDamage!: number;
    baseCoolDown!: number;

    constructor(name: string, spriteKey: string, baseDamage: number, baseCooldown: number) {
        this.name = name;
        this.spriteKey = spriteKey;
        this.baseCoolDown = baseCooldown;
        this.baseDamage = baseDamage;
    }
}