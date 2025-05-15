import GameCameras from "../entities/GameCameras";
import { SceneData } from "./SceneData";
import { Player } from "../entities/Player";
import { AnimatedTileData } from "./Tiles";
import AttackManager from "../entities/Attack";

/**
 * Cena básica do mundo.
 * 
 * Cuida de input, geração de mundo, etc.
 */
export default interface IBaseScene {
    /**
     * As câmeras do jogo.
     */
    gameCameras: GameCameras;

    /**
     * O jogador.
     */
    player: Player;

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
     * O map do jogo.
     */
    map: Phaser.Tilemaps.Tilemap;

    /**
     * As setas do teclado.
     */
    arrows: Phaser.Types.Input.Keyboard.CursorKeys;

    /**
     * As teclas 'A', 'W', 'S' e 'D'.
     */
    awsd: Phaser.Types.Input.Keyboard.CursorKeys;

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
    attackManager: AttackManager;

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
     * Configura os eventos de entrada do jogo (teclado e mouse).
     */
    setupInput(): void;

    /**
     * Configura o gerenciador de ataques.
     */
    setupAttackManager(): void;

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
}