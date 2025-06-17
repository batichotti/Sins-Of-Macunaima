import { Player } from "../entities/Player";
import { IPlayer, IPlayerExport } from "./Player";

/**
 * Coordena quanto de XP e pontos o jogador ganha no final da partida.
 */
export interface IPlayerProgressionSystem {
    /**
     * Instância do jogador.
     */
    player: IPlayer;

    /**
     * XP ganho até agora.
     */
    xpGained: number;

    /**
     * Pontos ganhos até agora.
     */
    pointsGained: number;

    /**
     * XP necessário para subir de nível.
     */
    xpLevelUpNeeded: number;

    increaseXP(xp: number): void;

    increasePoints(points: number): void;

    levelUp(): void;

    /**
    * Método para exportar informações.
    */
    export(): IMatchStats;
}

/**
* Interface para guardar dados da partida quando exportada.
*/
export interface IMatchStats {
  /**
  * O jogador.
  */
  player: IPlayerExport;

  /**
   * Pontuação.
   */
  pointsGained: number;

  /**
   * XP ganho.
   */
  xpGained: number;

  /**
   * Tempo decorrido.
   */
  timeElapsed: number;

  /**
   * Abates dados.
   */
  kills: number;
}
