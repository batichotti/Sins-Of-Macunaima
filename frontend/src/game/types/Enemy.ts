import { Grid, Pathfinding } from "../components/phaser-pathfinding";
import PathCache from "../core/PathCache";
import IBaseScene from "./BaseScene";
import { IMelee, IProjectile, MeleeEnum, MeleeTypes, ProjectileEnum, ProjectileTypes } from "./Weapon";

export interface WaypointNode {
  point: Phaser.Math.Vector2;
  g: number;
  h: number;
  f: number;
  parent: WaypointNode | null;
}

export interface IEnemyManager {
  enemySpawner: IEnemySpawner;
  gameFrozen: boolean;
  enemyPool: Phaser.Physics.Arcade.Group;
  scene: IBaseScene;
  pathFinder: Pathfinding;
  pathCache: PathCache;
  waypointGraph: Map<string, Phaser.Math.Vector2[]>;
  maxEnemyDistance: number;
  canPath: boolean;
  canSpawn: boolean;
  grid: Grid;
  playerPos: Phaser.Math.Vector2
  updateIndex: number;
  waypoints: Phaser.Math.Vector2[];
  maxDirectDistance: number;
  cooldownAttack: boolean;
  bossSpawned: boolean;
  bossCurrentlyAlive: boolean;
  bossDefeated: boolean;
  getTargetPosition(enemyPos: Phaser.Math.Vector2, playerPos: Phaser.Math.Vector2): Phaser.Math.Vector2;
  findPathViaWaypoints(start: Phaser.Math.Vector2, end: Phaser.Math.Vector2): Phaser.Math.Vector2[];
  findNearestWaypoint(position: Phaser.Math.Vector2): Phaser.Math.Vector2 | null;
  spawnEnemy(): void;
  findNearestEnemy(): Phaser.Math.Vector2 | null;
  updatePathing(): void;
  updateMovement(): void;
  destroy(): void;
}

export interface IEnemySpawner {
  scene: IBaseScene;
  lastPlayerPos: Phaser.Math.Vector2;
  spawnPoints: EnemySpawnPoints[];
  minDistance: number;
  maxDistance: number;
  canChoose: boolean;
  chooseSpawn(): EnemySpawnPoints | null;
}

/**
* Vetor de pares { 'string' | 'Phaser.Math.Vector2' }
*/
export interface EnemySpawnPoints {
  name: string;
  position: Phaser.Math.Vector2;
}

/**
 * Contém informações base dos inimigos.
 */
export interface IEnemy {
    /**
    * Nome do inimigo. Para ser usado especialmente no Bestiário.
    */
    name: string;

    /**
     * Chave do sprite. Deve ser igual ao importado pelo Phaser.js.
     */
    spriteKey: string;

    /**
     * Região onde o inimigo aparece.
     */
    spawnRegion: string;

    /**
     * Arma do inimigo.
     */
    weapon: IMelee;

    /**
     * Arma de longo alcance do inimigo.
     */
    projectileWeapon?: IProjectile;

    /**
     * Quantidade de vida base do inimigo.
     */
    baseHealth: number;

    /**
     * Velocidade base do inimigo.
     */
    baseSpeed: number;

    /**
     * Multiplicador de dano do inimigo. Escala com o nível do jogador.
     */
    damageMultiplier: number;

    /**
     * Pontuação ganha por matar o inimigo.
     */
    pointGain: number;
}

export enum EnemyEnum {
    COLONIZADOR,
    COBRA_CORAL,
    INDIO
}

/**
 * Array com os inimigos. Necessário para o 'EnemyManager' gerar um aleatoriamente.
 */
export const EnemyTypes: Record<EnemyEnum, IEnemy> = {
    [EnemyEnum.INDIO]: {
      name: 'Índio',
      spriteKey: 'Std-Char',
      spawnRegion: 'all',
      weapon: MeleeTypes[MeleeEnum.BENGALA],
      baseHealth: 20,
      baseSpeed: 120,
      damageMultiplier: 1.2,
      pointGain: 20
    },
    [EnemyEnum.COLONIZADOR]: {
      name: 'Colonizador',
      spriteKey: 'Colonizador',
      spawnRegion: 'Praia',
      weapon: MeleeTypes[MeleeEnum.ESPADA],
      baseHealth: 20,
      baseSpeed: 100,
      damageMultiplier: 1.2,
      pointGain: 20
    },
    [EnemyEnum.COBRA_CORAL]: {
      name: 'Cobra Coral',
      spriteKey: 'Snake',
      spawnRegion: 'all',
      weapon: MeleeTypes[MeleeEnum.PICADA],
      baseHealth: 15,
      baseSpeed: 160,
      damageMultiplier: 1.05,
      pointGain: 20
    }
};

export enum BossEnum {
  CR7,
  CABRAL
}

export const BossTypes: Record<BossEnum, IEnemy> = {
    [BossEnum.CR7]: {
        name: 'Cristiano Ronaldo',
        spriteKey: 'CR7',
        spawnRegion: 'all',
        weapon: MeleeTypes[MeleeEnum.PAULADA],
        projectileWeapon: ProjectileTypes[ProjectileEnum.BOLA],
        baseHealth: 150,
        baseSpeed: 120,
        damageMultiplier: 1.25,
        pointGain: 500
    },
    [BossEnum.CABRAL]: {
        name: 'Pedro Álvares Cabral',
        spriteKey: 'Cabral',
        spawnRegion: 'all',
        weapon: MeleeTypes[MeleeEnum.PAULADA],
        baseHealth: 150,
        baseSpeed: 120,
        damageMultiplier: 1.25,
        pointGain: 500
    }
};
