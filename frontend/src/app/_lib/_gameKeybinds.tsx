import styles from '@/styles/_gameKeybinds.module.css';

export default function GameKeybinds() {
    const controls = [
        { key: 'C', action: 'Trocar personagem' },
        { key: 'V', action: 'Trocar arma' },
        { key: 'Shift', action: 'Trocar modo de ataque' },
        { key: 'Setas', action: 'Ataque' },
        { key: 'Mouse esquerdo', action: 'Atacar' },
        { key: 'WASD', action: 'Mover personagem' }
    ]

    return (
        <div className={styles.controlsContainer}>
            <h4 className={styles.title}>Controles</h4>
            {controls.map((control, index) => (
            <div key={index} className={styles.control}>
                <kbd className={styles.key}>{control.key}</kbd>
                <span className={styles.action}>{control.action}</span>
            </div>
            ))}
        </div>
        )
  }
