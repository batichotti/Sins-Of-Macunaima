import { SceneData } from "./SceneData";
import { AnimatedTileData } from "./Tiles";
import { IGameCameras } from "./GameCameras";
import { IPlayer } from "./Player";
import { ICollectableManager } from "./Collectables";
import { IAnimationManager } from "./Animations";
import { IEnemyManager } from "./Enemy";
import { IInput } from "./Input";
import { IGameUI } from "./GameUI";
import { IAttackManager } from "./Attack";
import { IPlayerProgressionSystem } from "./PlayerProgressionSystem";

/**
 * Cena básica do mundo.
 *
 * Cuida de input, geração de mundo, etc.
 */
export default interface IBaseScene {
    /**
     * As câmeras do jogo.
     */
    gameCameras: IGameCameras;

    /**
     * O jogador.
     */
    player: IPlayer;

    /**
    * O sistema de coletáveis.
    */
    collectableManager: ICollectableManager;

    /**
     * Um array de tilesets do Tiled.
     */
    tilesets: Phaser.Tilemaps.Tileset[];

    /**
     * Um array de camadas do Tiled.
     */
    layers: Phaser.Tilemaps.TilemapLayer[];

    /**
     * Um array com os tiles animados.
     */
    animatedTiles: AnimatedTileData[];

    /**
     * O gerenciador de animações da cena base.
     */
    animationManager: IAnimationManager;

    /**
     * O gerenciador de inimigos.
     */
    enemyManager: IEnemyManager;

    /**
     * O map do jogo.
     */
    map: Phaser.Tilemaps.Tilemap;

    /**
     * O gerenciador do teclado e mouse.
     */
    inputManager: IInput;

    /**
     * Os dados da cena. Obtidos da cena de boot.
     */
    sceneData: SceneData;

    /**
     * Locais onde há pontos de transição de cena
     */
    transitionPoints: Phaser.Types.Tilemaps.TiledObject[];

    /**
     * Tiles com pontos de transição de cena.
     */
    transitionRects: Phaser.Geom.Rectangle[];

    /**
     * O gerenciador de ataques.
     */
    attackManager: IAttackManager;

    /**
     * A UI do jogo.
     */
    gameUI: IGameUI;

    /**
     * Sistema de pontos e xp do jogo.
     */
    playerProgressionSystem: IPlayerProgressionSystem;

    /**
     * Configura camadas.
     */
    setupLayers(): void;

    /**
     * Configura tiles animados.
     */
    setupAnimatedTiles(): void;

    /**
     * Constrói e configura o jogador.
     */
    setupPlayer(): void;

    /**
     * Configura as animações dos sprites.
     */
    setupAnimations(): void;

    /**
     * Configura os pontos de transição de cena.
     */
    setupTransitionPoints(): void;

    /**
     * Configura as colisões.
     */
    setupCollisions(): void;

    /**
     * Configura as câmeras do jogo.
     */
    setupCameras(): void;
    /**
     * Manuseia a entrada do jogador.
     */
    handleInput(): void;

    /**
     * Atualiza os tiles animados.
     * @param {number} delta - Tempo entre um quadro e outro. Dado pelo próprio Phaser Js.
     */
    handleAnimatedTiles(delta: number): void;

    /**
     * Método que fecha a cena atual e vai para o próximo cenário.
     */
    changeScenario(): void;

    /**
     * Executa o sistema de game over.
     */
    runGameOver(): void;
}
