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
