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
     * @returns Um vetor (x, y) com coordenadas de movimento.
     */
    handleArrows() {
        let movement = new Phaser.Math.Vector2(0, 0);
        if (this.awsd.left.isDown) movement.x = -1;
        if (this.awsd.right.isDown) movement.x = 1;
        if (this.awsd.up.isDown) movement.y = -1;
        if (this.awsd.down.isDown) movement.y = 1;

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
     * Controla o movimento de AWSD do teclado para atirar.
     * @returns Um vetor (x, y) com coordenadas caso haja um evento de teclado. Caso contrário `null`.
     */
    handleAwsd() : number | null {
        let coords = new Phaser.Math.Vector2(0, 0);

        if (this.arrows.left.isDown) coords.x = -1;
        if (this.arrows.right.isDown) coords.x = 1;
        if (this.arrows.up.isDown) coords.y = -1;
        if (this.arrows.down.isDown) coords.y = 1;

        if(coords.x || coords.y) {
            return Phaser.Math.Angle.Between(0, 0, coords.x, coords.y);
        } else {
            return null;
        }
        
    }

    /**
     * Controla o movimento do mouse para atirar.
     * @returns Um vetor (x, y) com coordenadas caso haja um evento do mouse. Caso contrário `null`.
     */
    handlePointer(x: number, y: number): number | null {
        if(this.mouse.isDown) {
            return Phaser.Math.Angle.Between(x, y, this.mouse.worldX, this.mouse.worldY);
        } else {
            return null;
        }
    }
}