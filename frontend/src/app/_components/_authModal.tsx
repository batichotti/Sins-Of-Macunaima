'use client';
import { useState, useRef } from 'react';
import styles from '@/styles/MainMenu.module.css';

export default function AuthModal() {
    const [activeForm, setActiveForm] = useState<'login' | 'signup' | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!formRef.current) return;
        
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries());
        console.log('Form data:', data);
        
        setActiveForm(null);
    };

    return (
        <div className={styles.AuthModalContainer}>
            <div className={styles.AuthModalButtons}>
                <button onClick={() => setActiveForm(activeForm === 'login' ? null : 'login')}>
                    Entrar
                </button>
                <button onClick={() => setActiveForm(activeForm === 'signup' ? null : 'signup')}>
                    Registrar
                </button>
            </div>

            <div className={styles.AuthModalContent}>
                {activeForm === 'login' && (
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <input name="email" type="email" placeholder="E-mail" defaultValue="" required />
                        <input name="password" type="password" placeholder="Senha" defaultValue="" required />
                        <button type="submit">Entrar</button>
                    </form>
                )}
                
                {activeForm === 'signup' && (
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <input name="username" type="text" placeholder="Nome de usuário" defaultValue="" required />
                        <input name="email" type="email" placeholder="E-mail" defaultValue="" required />
                        <input name="password" type="password" placeholder="Senha" defaultValue="" required />
                        <button type="submit">Registrar</button>
                    </form>
                )}
            </div>
        </div>
    );
}