import { TextBox } from "../components/TextBox";

/**
 * Interface com os elementos da UI na partida:
 * - Nome do jogador.
 * - Nome do personagem.
 * - Nível.
 * - Vida.
 * - Armas.
 */
export default interface IGameUI {
    playerLabel: TextBox;
    characterLabel: TextBox;
    levelLabel: TextBox;
    healthLabel: TextBox;
    weaponSetLabel: TextBox;
}