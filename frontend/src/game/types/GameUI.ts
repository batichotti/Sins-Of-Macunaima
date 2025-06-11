import { NotificationPopUp, TextBox, TimeCounter } from "../components/GameUI";
import { ICharacter } from "./Player";
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
  playerLabel: TextBox;
  characterLabel: TextBox;
  levelLabel: TextBox;
  healthLabel: TextBox;
  weaponSetLabel: TextBox;
  attackModeLabel: TextBox;
  killsLabel: TextBox;
  bossInfoLabel: TextBox;
  timeLabel: TimeCounter;
  notificationsLabel: NotificationPopUp;
  handlers: IGameUIHandlers;
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
