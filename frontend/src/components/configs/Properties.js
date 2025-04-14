// Este arquivo contém a centralização de variáveis comuns de valor fixo.

// Resolução da tela do jogo.
export const WindowResolution = {
  get width() { return window.innerWidth * 0.9 },
  get height() { return window.innerHeight * 0.9 }
};

// Propriedades comuns à textos.
export const Text = {
  Resolution: {
    get width() { return window.innerWidth * 0.45 },
    get height() { return window.innerHeight * 0.45 }
  },
  Properties_1: {
    fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
    stroke: '#000000', strokeThickness: 8,
    align: 'center'
  },
  Properties_2: {
    fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
    stroke: '#000000', strokeThickness: 8,
    align: 'center'
  },
};