import { NotificationPopUp, TextBox, TimeCounter } from "../components/GameUI";
import { ICharacter } from "./Player";
import { ITextBox } from "./TextBox";
import { AttackMode, IWeapon } from "./Weapon";

/**
 * Interface com os elementos da UI na partida:
 * - Nome do jogador.
 * - Nome do personagem.
 * - Nível.
 * - Vida.
 * - Armas.
 * - Inimigos abatidos.
 * - Informações dos Chefão atual.
 * - Notificações de coletáveis.
 * - Tempo de partida.
 * - Handlers para atualização de conteúdo.
 */
export interface IGameUI {
  playerLabel: ITextBox;
  characterLabel: ITextBox;
  levelLabel: ITextBox;
  healthLabel: ITextBox;
  weaponSetLabel: ITextBox;
  attackModeLabel: ITextBox;
  killsLabel: ITextBox;
  timeLabel: ITimeCounter;
  notificationsLabel: INotificationPopUp;
  handlers: IGameUIHandlers;
  destroy(): void;
}

export interface ICooldownBar {
  fill: Phaser.GameObjects.Graphics;
  width: number;
  height: number;
  startCooldown(duration: number): void;
  destroy(): void;
}

export interface ITimeCounter {
  get time(): number;
}

export interface INotificationPopUp {
  destroy(): void;
}

/**
* Handlers para atualização de conteúdo.
*/
export interface IGameUIHandlers {
  onHealthChange: (health: number) => void;
  onWeaponChange: (weapon: IWeapon) => void;
  onEnemyDied: (info: { points: number, kills: number }) => void;
  onLevelUp: (level: number) => void;
  onWeaponCooldown: (cooldown: number) => void;
  onAttackModeChange: (obj: AttackMode) => void;
  onCharacterChange: (character: ICharacter) => void;
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
    TIME: "Tempo: ",
    ATTACK_MODE: 'Modo de Ataque: ',
    BOSS_INFO: 'Chefão: ',
}
