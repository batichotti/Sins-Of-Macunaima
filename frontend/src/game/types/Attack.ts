import { IDisposable } from "./common";
import { AttackMode, IWeapon } from "./Weapon";

export interface IAttackManager extends IDisposable {
    attackMode: AttackMode;
    fire(x: number, y: number, angle: number): void;
    get weapon(): IWeapon;
}
