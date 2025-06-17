import { AttackMode, IWeapon } from "./Weapon";

export interface IAttackManager {
    attackMode: AttackMode;
    fire(x: number, y: number, angle: number): void;
    get weapon(): IWeapon;
    destroy(): void;
}