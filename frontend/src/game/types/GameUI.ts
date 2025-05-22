import { TextBox } from "../components/GameUI";

/**
 * Interface com os elementos da UI na partida:
 * - Nome do jogador.
 * - Nome do personagem.
 * - Nível.
 * - Vida.
 * - Armas.
 */
export interface IGameUI {
    playerLabel: TextBox;
    characterLabel: TextBox;
    levelLabel: TextBox;
    healthLabel: TextBox;
    weaponSetLabel: TextBox;
}

/**
 * Contém placeholders para textos da UI.
 */
export const GameUIPlaceholders = {
    PLAYER: "Jogador: ",
    CHARACTER: "Personagem: ",
    LEVEL: "Nível: ",
    HEALTH: "Vida: ",
    WEAPONSET: "Armas: ",
    POINTS: "PTS: "
}