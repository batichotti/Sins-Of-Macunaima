import GameUI from "../components/GameUI";
import IPlayerProgressionSystem from "../types/PlayerProgressionSystem";
import { Player } from "./Player";

export default class PlayerProgressionSystem implements IPlayerProgressionSystem {
    player: Player;
    xpGained: number = 0;
    pointsGained: number = 0;
    gameUI: GameUI;

    constructor(player: Player, gameUI: GameUI) {
        this.player = player;
        this.gameUI = gameUI;
    }

    increaseXP(xp: number) {
        this.xpGained += xp;
    }

    increasePoints(points: number) {
        this.pointsGained += points;
    }
}