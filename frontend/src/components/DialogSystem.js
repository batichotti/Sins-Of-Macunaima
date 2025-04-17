class DialogSystem {
    constructor(scene) {
        this.scene = scene;
        this.dialogBox; // Retângulo de fundo
        this.dialogText; // Texto do diálogo
        this.currentDialog = []; // Array com as falas
        this.currentLine = 0; // Linha atual
        this.isDialogActive = false; // Estado do diálogo
        this.isTyping = false; // Está digitando?
        this.typingSpeed = 50; // Velocidade da animação de digitação (ms)
        this.typingTimer; // Referência do timer
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // Criar elementos gráficos
        this.createDialogBox();
    }

    createDialogBox() {
        // Retângulo de fundo
        this.dialogBox = this.scene.add.graphics()
            .fillStyle(0x000000, 0.8)
            .fillRect(100, 400, 1000, 150)
            .setVisible(false);

        // Texto do diálogo
        this.dialogText = this.scene.add.text(120, 410, '', {
            font: '20px Arial',
            color: '#FFFFFF',
            wordWrap: { width: 960 }
        }).setVisible(false);
    }

    // Iniciar novo diálogo
    startDialog(dialogArray) {
        if (this.isDialogActive) return;
        
        this.currentDialog = dialogArray;
        this.currentLine = 0;
        this.isDialogActive = true;
        this.dialogBox.setVisible(true);
        this.dialogText.setVisible(true);
        
        this.showNextLine();
    }

    // Mostrar próxima linha
    showNextLine() {
        if (this.isTyping) return;

        if (this.currentLine >= this.currentDialog.length) {
            this.closeDialog();
            return;
        }

        const line = this.currentDialog[this.currentLine];
        this.animateText(line);
        this.currentLine++;
    }

    // Animação de digitação
    animateText(text) {
        this.isTyping = true;
        this.dialogText.setText('');
        let index = 0;
        
        this.typingTimer = this.scene.time.addEvent({
            delay: this.typingSpeed,
            callback: () => {
                this.dialogText.setText(this.dialogText.text + text[index]);
                index++;
                if (index >= text.length) {
                    this.isTyping = false; // Marca fim da animação
                    this.typingTimer.remove();
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    // Fechar diálogo
    closeDialog() {
        this.isDialogActive = false;
        this.dialogBox.setVisible(false);
        this.dialogText.setVisible(false);
        this.currentDialog = [];
    }

    // Atualizar (deve ser chamado no update da cena)
    update() {
        if (this.isDialogActive && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            // Bloqueia múltiplas entradas durante transições
            if (this.isTyping) {
                // Completa texto imediatamente
                this.typingTimer.remove();
                this.dialogText.setText(this.currentDialog[this.currentLine - 1]);
                this.isTyping = false;
                
                // Adiciona pequeno delay para evitar duplo avanço
                this.scene.time.delayedCall(100, () => {
                    this.isProcessing = false;
                });
            } else {
                // Impede avanço múltiplo
                if (this.isProcessing) return;
                this.isProcessing = true;
                
                this.showNextLine();
                
                // Reset após 200ms
                this.scene.time.delayedCall(200, () => {
                    this.isProcessing = false;
                });
            }
        }
    }
}

export default DialogSystem;