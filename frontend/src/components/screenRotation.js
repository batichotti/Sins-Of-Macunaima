import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';


// Detecta a orientação da tela do sistema e manda uma mensagem para mudar para paisagem.
function screenRotation() {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
      const checkOrientation = () => {
        setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
      };
  
      checkOrientation();
  
      window.addEventListener('orientationchange', checkOrientation);
      window.addEventListener('resize', checkOrientation);
  
      return () => {
        window.removeEventListener('orientationchange', checkOrientation);
        window.removeEventListener('resize', checkOrientation);
      };
    }, []);
  
    if (!isMobile || !isPortrait) return null;
  
    return (
        <div id='screen-rotation-prompt' style={styles.overlay}>
          <div style={styles.content}>
            <div style={styles.icon}>🔄</div>
            <h2>Gire seu dispositivo</h2>
            <p>Por favor, vire seu celular para a posição horizontal para uma melhor experiência</p>
          </div>
      </div>
    );
}


const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px',
    },
    content: {
      maxWidth: '400px',
    },
    icon: {
      fontSize: '50px',
      marginBottom: '20px',
      animation: 'rotate 2s infinite',
    },
}

export default screenRotation; 