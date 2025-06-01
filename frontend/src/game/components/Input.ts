import { IInput } from "../types";
import { EventManager, GameEvents } from "../core/EventBus";

export default class InputManager implements IInput {
    keyboard: Phaser.Input.Keyboard.KeyboardPlugin;
    mouse!: Phaser.Input.Pointer;
    arrows!: Phaser.Types.Input.Keyboard.CursorKeys;
    awsd!: Phaser.Types.Input.Keyboard.CursorKeys;
    scene: Phaser.Scene;
    toggleKey!: Phaser.Input.Keyboard.Key;
    attackModeKey!: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        if(this.scene.input.keyboard) {
            this.keyboard = this.scene.input.keyboard;    
            this.arrows = this.keyboard.createCursorKeys();

            this.awsd = this.keyboard.addKeys(
                {
                    'up': Phaser.Input.Keyboard.KeyCodes.W,
                    'down': Phaser.Input.Keyboard.KeyCodes.S,
                    'left': Phaser.Input.Keyboard.KeyCodes.A,
                    'right': Phaser.Input.Keyboard.KeyCodes.D,

                }
            ) as Phaser.Types.Input.Keyboard.CursorKeys;

            this.toggleKey = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            this.attackModeKey = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        } else {
            console.error("Teclado não disponível.\n");
        }

        if(this.scene.input.activePointer) {
            this.mouse = this.scene.input.activePointer;
        } else {
            console.error("Mouse não disponível.\n");
        }
    }

    /**
     * Controla o movimento pelas setas do teclado.
     * @returns Um vetor (x, y) com coordenadas de movimento já normalizados.
     */
    getMovementInput(): Phaser.Math.Vector2 {
        const movement = new Phaser.Math.Vector2(0, 0);
        
        // WASD para movimento
        if (this.awsd.left.isDown) movement.x = -1;   // A
        if (this.awsd.right.isDown) movement.x = 1;   // D
        if (this.awsd.up.isDown) movement.y = -1;     // W
        if (this.awsd.down.isDown) movement.y = 1;    // S

        return movement.normalize();
    }

    /**
     * Controla as teclas de modo de ataque e trocar de arma.
     * 
     * Usa-se o sistema de eventos do Phaser para atualizar a UI.
     */
    handleUtilKeys() {
        if(Phaser.Input.Keyboard.JustDown(this.toggleKey)) {
            EventManager.getInstance().emit(GameEvents.TOGGLE_WEAPON);
        }

        if(Phaser.Input.Keyboard.JustDown(this.attackModeKey)) {
            EventManager.getInstance().emit(GameEvents.TOGGLE_ATTACK_MODE);
        }
    }
    
    /**
     * Controla a direção de mira pelas setas do teclado.
     * @returns Um vetor (x, y) com coordenadas de mira ou null se nenhuma tecla estiver pressionada.
     */
    getKeyboardAimInput(): Phaser.Math.Vector2 | null {
        const aim = new Phaser.Math.Vector2(0, 0);

        // Setas para mira
        if (this.arrows.left.isDown) aim.x = -1;
        if (this.arrows.right.isDown) aim.x = 1;
        if (this.arrows.up.isDown) aim.y = -1;
        if (this.arrows.down.isDown) aim.y = 1;

        return (aim.x !== 0 || aim.y !== 0) ? aim.normalize() : null;
    }

    /**
     * Controla a direção de mira pelo mouse.
     * @param playerX Posição X do jogador
     * @param playerY Posição Y do jogador
     * @returns Um vetor (x, y) com direção de mira ou null se o mouse não estiver pressionado.
     */
    getMouseAimInput(playerX: number, playerY: number): Phaser.Math.Vector2 | null {
        if(this.mouse.isDown) return new Phaser.Math.Vector2(this.mouse.worldX - playerX, this.mouse.worldY - playerY).normalize();
        return null;
    }

    /**
     * Verifica se há input de ataque (mouse ou setas).
     * @returns true se há input de ataque
     */
    hasAttackInput(): boolean {
        return this.mouse.isDown || this.arrows.left.isDown || this.arrows.right.isDown || this.arrows.up.isDown || this.arrows.down.isDown;
    }
}