import { IEnemy } from "./Enemy";
import { ICharacter } from "./Player";
import { AttackMode, IWeapon } from "./Weapon";

/**
 * Usado para coordenar eventos do jogo.
 */
export enum GameEvents {
  /**
  * Inimigo morreu.
  */
  ENEMY_DIED = 'enemyDied',
  /**
  * Jogador subiu de nível.
  */
  LEVEL_UP = 'levelUp',
  /**
  * Jogador ganhou ou perdeu vida.
  */
  HEALTH_CHANGE = 'healthChange',
  /**
  * Jogador trocou de arma.
  */
  TOGGLE_WEAPON = 'toggleWeapon',
  /**
  * Foi possível trocar de arma.
  */
  TOGGLE_WEAPON_SUCCESS = 'toggleWeaponSuccess',
  /**
  * Cooldown da arma.
  */
  WEAPON_COOLDOWN = 'weaponCooldown',
  /**
  * Jogador morreu.
  */
  PLAYER_DIED = 'playerDied',
  /**
  * Jogador ganhou ou perdeu pontos.
  */
  POINT_CHANGE = 'pointChange',
  /**
  * Jogador trocou de modo de ataque.
  */
  TOGGLE_ATTACK_MODE = 'tooggleAttackMode',
  /**
  * O sistema conseguiu mudar o modo de ataque.
  */
  TOGGLE_ATTACK_MODE_SUCCESS = 'toggleAttackModeSucceded',
  /**
  * O jogo deve spawnar um boss.
  */
  SHOULD_SPAWN_BOSS = 'shouldSpawnBoss',
  /**
  * Boss foi spawnado.
  */
  BOSS_SPAWNED = 'bossSpawned',
  /**
  * Boss foi derrotado.
  */
  BOSS_DEFEATED = 'bossDefeated',
  /**
  * Jogador trocou de personagem.
  */
  TOGGLE_CHARACTER = 'toggleCharacter',
  /**
  * Jogador trocou de personagem.
  */
  TOGGLE_CHARACTER_SUCCESS = 'toggleCharacterSucceded'
}

/**
* Os payloads que são dados aos callbacks.
*/
export type GameEventsPayloads = {
  /**
  * Points: Pontos ganhos até agora.
  *
  * Kills: Mortes causadas até agora.
  */
  [GameEvents.ENEMY_DIED]: { points: number; kills: number };

  /**
  * Retorna o nível atual.
  */
  [GameEvents.LEVEL_UP]: number;

  /**
  * Retorna a vida atual.
  */
  [GameEvents.HEALTH_CHANGE]: number;

  /**
  * Para trocar de arma.
  */
  [GameEvents.TOGGLE_WEAPON]: null;

  /**
  * Para trocar de arma.
  */
  [GameEvents.TOGGLE_WEAPON_SUCCESS]: IWeapon;

  /**
  * Retorna o cooldown da arma.
  */
  [GameEvents.WEAPON_COOLDOWN]: number;

  /**
  * O jogador morreu.
  */
  [GameEvents.PLAYER_DIED]: null;

  /**
  * Sinal para trocar de modo
  */
  [GameEvents.TOGGLE_ATTACK_MODE]: null;

  /**
  * Foi possível alterar o modo de ataque.
  *
  * Retorna o modo atual.
  */
  [GameEvents.TOGGLE_ATTACK_MODE_SUCCESS]: AttackMode;

  /**
   * Deve spawnar um boss.
   */
  [GameEvents.SHOULD_SPAWN_BOSS]: null;

  /**
   * Boss foi spawnado.
   */
  [GameEvents.BOSS_SPAWNED]: IEnemy;

  /**
   * Boss foi derrotado.
   */
  [GameEvents.BOSS_DEFEATED]: null;

  /**
   * Jogador trocou de personagem.
   */
  [GameEvents.TOGGLE_CHARACTER]: null;

  /**
   * Jogador trocou de personagem.
   */
  [GameEvents.TOGGLE_CHARACTER_SUCCESS]: ICharacter;
}

export interface EventListener<T extends keyof GameEventsPayloads> {
  event: T;
  callback: (data: GameEventsPayloads[T]) => void;
  context?: object;
}
