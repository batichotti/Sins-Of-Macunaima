import { IMatchStats, IPlayerProgressionSystem } from "../types";
import { Player } from "./Player";

export default class PlayerProgressionSystem implements IPlayerProgressionSystem {
    player: Player;
    xpGained: number = 0;
    pointsGained: number = 0;
    xpLevelUpNeeded: number = 200;
    timeElapsed: number = 0;

    constructor(player: Player) {
      this.player = player;
      this.xpLevelUpNeeded += this.player.level.level * 10;
      this.timeElapsed = Date.now();
    }

    increaseXP(xp: number) {
      this.xpGained += xp;
      const needed = this.xpLevelUpNeeded;
      if (this.xpGained >= needed) {
        this.xpGained -= needed;
        this.xpLevelUpNeeded = this.player.level.level * 10 + 200;
        this.levelUp();
      }
    }

    increasePoints(points: number) {
      this.pointsGained += points;
    }

    levelUp() {
      this.player.levelUp();
    }

    /**
    * Método para exportar informações.
    */
    export(): IMatchStats {
      return {
        player: this.player.export(),
        xpGained: this.xpGained,
        pointsGained: this.pointsGained,
        timeElapsed: Date.now() - this.timeElapsed
      }
    }
}
