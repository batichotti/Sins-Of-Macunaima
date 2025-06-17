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

    /**
     * Controla o movimento pelas teclas WASD.
     * @returns Um vetor normalizado (x, y) com coordenadas de movimento.
     */
    getMovementInput(): Phaser.Math.Vector2;

    /**
     * Controla as teclas de modo de ataque e trocar de arma.
     * Usa o sistema de eventos do Phaser para atualizar a UI.
     */
    handleUtilKeys(): void;

    /**
     * Controla a direção de mira pelas setas do teclado.
     * @returns Um vetor normalizado (x, y) com coordenadas de mira ou null se nenhuma tecla estiver pressionada.
     */
    getKeyboardAimInput(): Phaser.Math.Vector2 | null;

    /**
     * Controla a direção de mira pelo mouse.
     * @param playerX Posição X do jogador
     * @param playerY Posição Y do jogador
     * @returns Um vetor normalizado (x, y) com direção de mira ou null se o mouse não estiver pressionado.
     */
    getMouseAimInput(playerX: number, playerY: number): Phaser.Math.Vector2 | null;

    /**
     * Verifica se há input de ataque (mouse ou setas).
     * @returns true se há input de ataque
     */
    hasAttackInput(): boolean;

    /**
     * Obtém a posição atual do mouse em coordenadas do mundo.
     * @returns Vetor com a posição do mouse ou null se o mouse não estiver disponível
     */
    getMouseWorldPosition(): Phaser.Math.Vector2 | null;

    /**
     * Método de limpeza para remover event listeners e liberar recursos.
     */
    destroy(): void;
}
