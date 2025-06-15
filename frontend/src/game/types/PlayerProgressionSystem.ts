import { Player } from "../entities/Player";
import { IPlayer } from "./Player";

/**
 * Coordena quanto de XP e pontos o jogador ganha no final da partida.
 */
export interface IPlayerProgressionSystem {
    /**
     * Instância do jogador.
     */
    player: Player;

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
}

/**
* Interface para guardar dados da partida quando exportada.
*/
export interface IMatchStats {
  /**
  * O jogador.
  */
  player: IPlayer;

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
