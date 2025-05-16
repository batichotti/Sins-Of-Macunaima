/**
 * Interface com informações da entrada do usuário.
 */
export interface IInput {
    /**
     * O teclado.
     */
    keyboard: Phaser.Input.Keyboard.KeyboardPlugin;

    /**
     * O mouse.
     */
    mouse: Phaser.Input.Pointer;

    /**
     * As setas do teclado.
     */
    arrows: Phaser.Types.Input.Keyboard.CursorKeys;

    /**
     * As teclas 'A', 'W', 'S' e 'D' do teclado.
     */
    awsd: Phaser.Types.Input.Keyboard.CursorKeys;
}