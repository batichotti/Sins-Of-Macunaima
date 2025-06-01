import { TextBox } from "../components/GameUI";

/**
 * Interface com os elementos da UI na partida:
 * - Nome do jogador.
 * - Nome do personagem.
 * - Nível.
 * - Vida.
 * - Armas.
 * - Inimigos abatidos.
 * - Informações dos Chefão atual.
 */
export interface IGameUI {
    playerLabel: TextBox;
    characterLabel: TextBox;
    levelLabel: TextBox;
    healthLabel: TextBox;
    weaponSetLabel: TextBox;
    attackModeLabel: TextBox;
    killsLabel: TextBox;
    bossInfoLabel: TextBox;
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
    ATTACK_MODE: 'Modo de Ataque: ',
    BOSS_INFO: 'Chefão: '
}