import { AttackMode } from "./Weapon";

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
  TOGGLE_ATTACK_MODE_SUCCEDED = 'toggleAttackModeSucceded',
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
  TOGGLE_CHARACTER_SUCCEDED = 'toggleCharacterSucceded'
}

/**
* Os payloads que são dados aos callbacks.
*/
export interface GameEventsPayloads {
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
  [GameEvents.TOGGLE_WEAPON]: void;

  /**
  * Retorna o cooldown da arma.
  */
  [GameEvents.WEAPON_COOLDOWN]: number;

  /**
  * O jogador morreu.
  */
  [GameEvents.PLAYER_DIED]: void;

  /**
  * Foi possível alterar o modo de ataque.
  *
  * Retorna o modo atual.
  */
  [GameEvents.TOGGLE_ATTACK_MODE_SUCCEDED]: AttackMode;

  /**
  * Retorna o nome do personagem atual após a troca.
  */
  [GameEvents.TOGGLE_CHARACTER_SUCCEDED]: string;
}
