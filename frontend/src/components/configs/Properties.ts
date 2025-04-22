// Este arquivo contém a centralização de variáveis comuns de valor fixo.

// Resolução da tela do jogo.
export const WindowResolution = {
  get width(): number { return window.innerWidth * 0.9 },
  get height(): number { return window.innerHeight * 0.9 }
};

// Propriedades comuns à textos.
// Responsivo de acordo com a altura da tela.
// TODO: definir um limite máximo de tamanho de fonte (até 1080p ser responsivo talvez).
export const Text = {
  Resolution: {
    get width(): number { return window.innerWidth * 0.45 },
    get height(): number { return window.innerHeight * 0.45 }
  },
  Title1: {
    fontFamily: 'Arial Black',
    fontSize: window.innerHeight * 0.05,
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: window.innerHeight * 0.01,
    align: 'center'
  },
  Title2: {
    fontFamily: 'Arial Black',
    fontSize: window.innerHeight * 0.1,
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: window.innerHeight * 0.01,
    align: 'center'
  },
  Dialog1: {
    font: '20px Arial',
    color: '#FFFFFF',
    wordWrap: { width: 960 }
  }
};