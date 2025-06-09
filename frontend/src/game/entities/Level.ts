import { EventManager } from "../core/EventBus";
import { ILevel } from "../types";
import { GameEvents } from "../types";

export class Level implements ILevel {
    level!: number;
    healthIncrease: number = 1;
    damageIncrease: number = 1;
    private healthModifier: number = 0.1;
    private damageModifier: number = 0.05;

    constructor(level: number) {
        this.level = level === 0 ? 1 : Math.abs(level);
        this.calculateModifiers();
    }

    private calculateModifiers(): void {
        this.healthIncrease = 1 + (this.level - 1) * this.healthModifier;
        this.damageIncrease = 1 + (this.level - 1) * this.damageModifier;
    }

    levelUp() {
      this.level += 1;
      this.calculateModifiers();
      EventManager.Instance.emit(GameEvents.LEVEL_UP, { level: this.level });
    }

    /**
     * Método para exportar as informações do nível.
     */
    export(): ILevel {
      return {
        level: this.level,
        healthIncrease: this.healthIncrease,
        damageIncrease: this.damageIncrease
      };
    }
};
