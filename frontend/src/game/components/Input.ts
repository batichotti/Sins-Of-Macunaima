import { IInput } from "../types";
import { EventManager, GameEvents } from "../core/EventBus";
import { BaseScene } from "../core/BaseScene";

export default class InputManager implements IInput {
    keyboard: Phaser.Input.Keyboard.KeyboardPlugin;
    mouse!: Phaser.Input.Pointer;
    arrows!: Phaser.Types.Input.Keyboard.CursorKeys;
    awsd!: Phaser.Types.Input.Keyboard.CursorKeys;
    scene: BaseScene;
    toggleWeaponKey!: Phaser.Input.Keyboard.Key;
    toggleCharacterKey: Phaser.Input.Keyboard.Key;
    attackModeKey!: Phaser.Input.Keyboard.Key;
    eventManager: EventManager;
    isInitialized = false;

    constructor(scene: BaseScene) {
        this.scene = scene;
        this.eventManager = EventManager.getInstance();
        this.initializeInput();
    }

    private initializeInput(): void {
        this.initializeKeyboard();
        this.initializeMouse();
        this.isInitialized = true;
    }

    private initializeKeyboard(): void {
        if (!this.scene.input.keyboard) {
            console.error("Teclado não disponível");
            return;
        }

        this.keyboard = this.scene.input.keyboard;
        this.arrows = this.keyboard.createCursorKeys();

        // Teclas WASD para movimento
        this.awsd = this.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D,
        }) as Phaser.Types.Input.Keyboard.CursorKeys;

        // Teclas utilitárias
        this.toggleWeaponKey = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
        this.toggleCharacterKey = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.attackModeKey = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    }

    private initializeMouse(): void {
        if (!this.scene.input.activePointer) {
            console.error("Mouse não disponível");
            return;
        }

        this.mouse = this.scene.input.activePointer;
    }

    /**
     * Controla o movimento pelas teclas WASD.
     * @returns Um vetor normalizado (x, y) com coordenadas de movimento.
     */
    getMovementInput(): Phaser.Math.Vector2 {
        if (!this.isInitialized || !this.awsd) {
            return new Phaser.Math.Vector2(0, 0);
        }

        const movement = new Phaser.Math.Vector2(0, 0);

        // WASD para movimento
        if (this.awsd.left.isDown) movement.x = -1;   // A
        if (this.awsd.right.isDown) movement.x = 1;   // D
        if (this.awsd.up.isDown) movement.y = -1;     // W
        if (this.awsd.down.isDown) movement.y = 1;    // S

        // Retorna vetor normalizado apenas se há movimento real
        return movement.x !== 0 || movement.y !== 0 ? movement.normalize(): movement;
    }

    /**
     * Controla as teclas de modo de ataque e trocar de arma.
     * Usa o sistema de eventos do Phaser para atualizar a UI.
     */
    handleUtilKeys(): void {
        if (!this.isInitialized) return;

        if (Phaser.Input.Keyboard.JustDown(this.toggleWeaponKey)) {
            this.eventManager.emit(GameEvents.TOGGLE_WEAPON);
        }

        if (Phaser.Input.Keyboard.JustDown(this.attackModeKey)) {
            this.eventManager.emit(GameEvents.TOGGLE_ATTACK_MODE);
        }

        if (Phaser.Input.Keyboard.JustDown(this.toggleCharacterKey)) {
            this.eventManager.emit(GameEvents.TOGGLE_CHARACTER);
        }
    }

    /**
     * Controla a direção de mira pelas setas do teclado.
     * @returns Um vetor normalizado (x, y) com coordenadas de mira ou null se nenhuma tecla estiver pressionada.
     */
    getKeyboardAimInput(): Phaser.Math.Vector2 | null {
        if (!this.isInitialized || !this.arrows) {
            return null;
        }

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
     * @returns Um vetor normalizado (x, y) com direção de mira ou null se o mouse não estiver pressionado.
     */
    getMouseAimInput(playerX: number, playerY: number): Phaser.Math.Vector2 | null {
        if (!this.isInitialized || !this.mouse || !this.mouse.isDown) {
            return null;
        }
        this.mouse.updateWorldPoint(this.scene.gameCameras.main);
        const direction = new Phaser.Math.Vector2(
            this.mouse.worldX - playerX,
            this.mouse.worldY - playerY
        );

        return direction.length() > 0 ? direction.normalize() : null;
    }

    /**
     * Verifica se há input de ataque (mouse ou setas).
     * @returns true se há input de ataque
     */
    hasAttackInput(): boolean {
        if (!this.isInitialized) return false;

        const mouseAttack = this.mouse?.isDown || false;
        const keyboardAttack = this.arrows && (
            this.arrows.left.isDown ||
            this.arrows.right.isDown ||
            this.arrows.up.isDown ||
            this.arrows.down.isDown
        );

        return mouseAttack || keyboardAttack || false;
    }

    /**
     * Obtém a posição atual do mouse em coordenadas do mundo.
     * @returns Vetor com a posição do mouse ou null se o mouse não estiver disponível
     */
    getMouseWorldPosition(): Phaser.Math.Vector2 | null {
        if (!this.isInitialized || !this.mouse) {
            return null;
        }

        return new Phaser.Math.Vector2(this.mouse.worldX, this.mouse.worldY);
    }

    /**
     * Verifica se uma tecla específica está sendo pressionada.
     * @param keyCode O código da tecla Phaser para verificar
     * @returns true se a tecla estiver pressionada
     */
    isKeyPressed(keyCode: number): boolean {
        if (!this.isInitialized || !this.keyboard) {
            return false;
        }

        const key = this.keyboard.addKey(keyCode);
        return key.isDown;
    }

    /**
     * Método de limpeza para remover event listeners e liberar recursos.
     */
    destroy(): void {
        // Reinicia estado
        this.isInitialized = false;

        // Limpa referências
        this.keyboard = null as any;
        this.mouse = null as any;
        this.arrows = null as any;
        this.awsd = null as any;
        this.toggleWeaponKey = null as any;
        this.toggleCharacterKey = null as any;
        this.attackModeKey = null as any;
    }
}
