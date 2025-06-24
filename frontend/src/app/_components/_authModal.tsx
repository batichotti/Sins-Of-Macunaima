import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/layout.module.css';

export default function AuthModal() {
    const [isLogged, setIsLogged] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    return (
        <div>
            isLogged ? (
                <p>Olá jogador!</p>
            ) : (

            )
            <button className={styles.AuthModal} onClick={() => !isLogged && setIsOpen(!isOpen)}>
                {isLogged ? `Olá ${'Seu Cachorro'}` : 'Entrar / Registrar'}
            </button>
            {isOpen && (
                <div className={styles.AuthModalContent}>
                    <form>
                        <input type="text" placeholder="E-mail" required />
                        <input type="password" placeholder="Senha" required />
                        <button type="submit">Entrar / Registrar</button>
                    </form>
                </div>
                )
            }
        </div>
    );
}