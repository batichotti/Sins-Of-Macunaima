import IPlayerProgressionSystem from "../types/PlayerProgressionSystem";
import { Player } from "./Player";

export default class PlayerProgressionSystem implements IPlayerProgressionSystem {
    player: Player;
    xpGained: number = 0;
    pointsGained: number = 0;
    xpLevelUpNeeded: number = 500;

    constructor(player: Player) {
        this.player = player;
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
        this.player.level.levelUp();
    }
}