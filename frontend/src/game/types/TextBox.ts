/**
 * Caixas de texto usando conteineres Phaser Js.
 */
export interface ITextBox {
    /**
     * Tamanho do contêiner.
     */
    size: Phaser.Math.Vector2;

    /**
     * O fundo do contêiner.
     */
    background: Phaser.GameObjects.Graphics;

    /**
     * O texto.
     */
    text: Phaser.GameObjects.Text;

    /**
     * Muda o texto.
     * @param {string} newText - O novo texto a ser usado.
     */
    setText(newText: string): void;

    /**
     * Mostra a caixa de texto.
     */
    show(): void;

    /**
     * Esconde a caixa de texto.
     */
    hide(): void;
}