import { useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    const currentScene = (scene?: Phaser.Scene) => {
        if (!scene || !scene.scene) return;
        console.log(scene.scene.key);
    }

    return (
        <div id="app" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <header style={{
                width: '100%',
                padding: '2vw 4vw',
                background: '#222',
                color: '#fff',
                textAlign: 'center',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxSizing: 'border-box'
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: 'clamp(1.2rem, 3vw, 2.5rem)',
                    flex: 1,
                    textAlign: 'center'
                }}>Sins Of Macunaíma</h1>
                <button
                    style={{
                        background: '#fff',
                        color: '#222',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.5em 1.5em',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginLeft: 'auto',
                        fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)'
                    }}
                    onClick={async () => {
                        try {
                            const response = await fetch('http://localhost:3001/user/top');
                            const data = await response.text();
                            alert(data);
                        } catch (error) {
                            alert('Erro ao buscar top scorers! ' + error);
                        }
                    }}
                >
                    Top Scorers
                </button>
            </header>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
                <div style={{
                    width: '100vw',
                    maxWidth: '100%',
                    height: 'calc(100vh - 80px)',
                    maxHeight: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
                </div>
            </div>
        </div>
    )
}

export default App
