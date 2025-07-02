import { BaseScene } from "../core/BaseScene";
import { EventManager } from "../core/EventBus";
import { GameEvents, IMatchStats, IPlayerProgressionSystem } from "../types";
import { Player } from "./Player";

export default class PlayerProgressionSystem implements IPlayerProgressionSystem {
    player: Player;
    xpGained: number = 0;
    pointsGained: number = 0;
    xpLevelUpNeeded: number = 20;
    scene: BaseScene;
    private pointsThreshold: number = 150;

    constructor(scene: BaseScene, player: Player) {
      this.scene = scene;
      this.player = player;
      this.xpLevelUpNeeded += this.player.level.level * 2;
    }

    public increaseXP(xp: number) {
      this.xpGained += xp;
      const needed = this.xpLevelUpNeeded;
      if (this.xpGained >= needed) {
        this.xpGained -= needed;
        this.xpLevelUpNeeded = this.player.level.level + 20;
        this.levelUp();
      }
    }

    public increasePoints(points: number) {
      this.pointsGained += points;
      if(this.pointsGained % this.pointsThreshold == 0 && this.pointsGained >= 1) {
          EventManager.Instance.emit(GameEvents.SHOULD_SPAWN_BOSS, null);
      }
    }

    public levelUp() {
      this.player.levelUp();
    }

    /**
    * Método para exportar informações.
    */
    public export(): IMatchStats {
      return {
        player: this.player.export(),
        xpGained: this.xpGained,
        pointsGained: this.pointsGained,
        timeElapsed: this.scene.gameUI.timeLabel.time,
        kills: this.scene.attackManager.getKills
      }
    }
}
