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

    /**
     * Tecla usada para trocar de arma.
     */
    toggleWeaponKey: Phaser.Input.Keyboard.Key;

    /**
    * Tecla usada para trocar de personagem.
    */
    toggleCharacterKey: Phaser.Input.Keyboard.Key;

    /**
     * Tecla usada para trocar de modo de ataque (manual ou automático).
     */
    attackModeKey: Phaser.Input.Keyboard.Key;
}
