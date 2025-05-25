import { TextBox } from "../components/GameUI";
import { AttackMode } from "./Weapon";

/**
 * Interface com os elementos da UI na partida:
 * - Nome do jogador.
 * - Nome do personagem.
 * - Nível.
 * - Vida.
 * - Armas.
 * - Inimigos abatidos.
 */
export interface IGameUI {
    playerLabel: TextBox;
    characterLabel: TextBox;
    levelLabel: TextBox;
    healthLabel: TextBox;
    weaponSetLabel: TextBox;
    attackModeLabel: TextBox;
    killsLabel: TextBox;
}

/**
 * Contém placeholders para textos da UI.
 */
export const GameUIPlaceholders = {
    PLAYER: "Jogador: ",
    CHARACTER: "Personagem: ",
    LEVEL: "Nível: ",
    HEALTH: "Vida: ",
    WEAPONSET: "Arma atual: ",
    POINTS: "PTS: ",
    KILLS: "Abates: ",
    ATTACK_MODE: 'Modo de Ataque: '
}