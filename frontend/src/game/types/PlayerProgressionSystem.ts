import { Player } from "../entities/Player";

/**
 * Coordena quanto de XP e pontos o jogador ganha no final da partida.
 */
export default interface IPlayerInMatchProgressionSystem {
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
}