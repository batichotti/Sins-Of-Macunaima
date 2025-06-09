import { IMatchStats, IPlayerProgressionSystem } from "../types";
import { Player } from "./Player";

export default class PlayerProgressionSystem implements IPlayerProgressionSystem {
    player: Player;
    xpGained: number = 0;
    pointsGained: number = 0;
    xpLevelUpNeeded: number = 500;
    timeElapsed: number = 0;

    constructor(player: Player) {
      this.player = player;
      this.xpLevelUpNeeded += this.player.level.level * 10;
      this.timeElapsed = Date.now();
    }

    increaseXP(xp: number) {
      this.xpGained += xp;
      if(this.xpGained >= this.player.level.level * this.xpLevelUpNeeded * 0.25) {
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
