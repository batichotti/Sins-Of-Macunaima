/**
 * Câmeras do jogo.
 */
export interface IGameCameras {
    /**
     * Câmera principal do jogo. Acompanha o jogador.
     */
    main: Phaser.Cameras.Scene2D.Camera;

    /**
     * Câmera da UI. Serve para organizar os conteúdos na tela.
     */
    ui: Phaser.Cameras.Scene2D.Camera;

    /**
     * Referência da cena atual.
     */
    scene: Phaser.Scene;

    /**
     * Inicializa as câmeras.
     * @param {number} width  - Largura original da tela.
     * @param {number} height - Altura original da tela.
     */
    initCameras(width: number, height: number): void;
}