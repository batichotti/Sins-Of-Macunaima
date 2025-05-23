import IPlayerProgressionSystem from "../types/PlayerProgressionSystem";
import { Player } from "./Player";

export default class PlayerProgressionSystem implements IPlayerProgressionSystem {
    player: Player;
    xpGained: number = 0;
    pointsGained: number = 0;

    constructor(player: Player) {
        this.player = player;
    }

    increaseXP(xp: number) {
        this.xpGained += xp;
    }

    increasePoints(points: number) {
        this.pointsGained += points;
    }
}