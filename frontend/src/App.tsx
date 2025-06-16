import { useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';

function App() {
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        setCanMoveSprite(scene.scene.key !== 'Mapa');
    }

    return (
        <div id="app">
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                padding: '16px',
                background: '#222',
                color: '#fff',
                textAlign: 'center',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', flex: 1, textAlign: 'center' }}>Sins Of Macunaíma</h1>
                <button
                    style={{
                        background: '#fff',
                        color: '#222',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginLeft: 'auto'
                    }}
                    onClick={async () => {
                        try {
                            const response = await fetch('http://localhost:3001/user/top');
                            const data = await response.json();
                            alert(JSON.stringify(data, null, 2));
                        } catch (error) {
                            alert('Erro ao buscar top scorers!');
                        }
                    }}
                >
                    Top Scorers
                </button>
            </header>
            <div style={{ paddingTop: '64px' }}></div>
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
        </div>
    )
}

export default App
