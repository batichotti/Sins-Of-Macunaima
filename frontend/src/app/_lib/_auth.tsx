import styles from '@/styles/MainMenu.module.css';
import { useRef, useState } from 'react';
import { useAuth } from '../_context/_authContext';

interface signinDTO {
    email: string,
    password: string
}

interface signupDTO extends signinDTO {
    name: string
}

export function AuthModal() {
    const [activeForm, setActiveForm] = useState<'signin' | 'signup' | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { login } = useAuth();

    const [signupDTO, setSignupDTO] = useState<signupDTO>({name: '', email: '', password: ''});
    const [signinDTO, setSigninDTO] = useState<signinDTO>({email: '', password: ''});
    
    async function handleSignin() {
        if (!formRef.current) return;

        try {
            const response = await fetch(
                'http://localhost:3001/auth/signin',
                {
                    method: 'POST',
                    headers: { 'Content-type' : 'application/json' },
                    body: JSON.stringify(signinDTO)
                }
            );
            if(response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                login(data.user);
                setActiveForm(null);
            } else {
                const errorData = await response.json();
                switch (response.status) {
                    case 400:
                        alert(errorData.message || 'Dados inválidos');
                        break;
                    case 401:
                        alert('Email ou senha incorretos');
                        break;
                    case 422:
                        alert('Dados mal formatados');
                        break;
                    default:
                        alert('Erro no servidor. Tente novamente.');
                }
            } 
        } catch (error) {
            alert('Erro ao buscar usuário ' + error);
        }
    }

    async function handleSignup() {
        if (!formRef.current) return;
        try {
            const response = await fetch(
                'http://localhost:3001/auth/signup',
                {
                    method: 'POST',
                    headers: { 'Content-type' : 'application/json' },
                    body: JSON.stringify(signupDTO)
                }
            );
            if(response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                login(data.user);
                setActiveForm(null);
            } else {
                const errorData = await response.json();
                
                switch (response.status) {
                    case 400:
                        alert(errorData.message || 'Erro nos dados fornecidos');
                        break;
                    case 409:
                        alert('Este email já está cadastrado');
                        break;
                    case 422:
                        alert('Senha muito fraca ou dados inválidos');
                        break;
                    default:
                        alert('Erro no servidor. Tente novamente.');
                }
            }
        } catch (error) {
            alert('Erro ao cadastrar ' + error);
        }
    }

    return (
        <div className={styles.AuthModalContainer}>
            <div className={styles.AuthModalButtons}>
                <button onClick={() => setActiveForm(activeForm === 'signin' ? null : 'signin')}>
                    Entrar
                </button>
                <button onClick={() => setActiveForm(activeForm === 'signup' ? null : 'signup')}>
                    Registrar
                </button>
            </div>

            <div className={styles.AuthModalContent}>
                {activeForm === 'signin' && (
                    <form ref={formRef} onSubmit={e => {e.preventDefault(), handleSignin(), setActiveForm(null)}}>
                        <input name="email" type="email" placeholder="E-mail" defaultValue="" onChange={e => setSigninDTO({...signinDTO, email: e.target.value})} required />
                        <input name="password" type="password" placeholder="Senha" defaultValue="" onChange={e => setSigninDTO({...signinDTO, password: e.target.value})} required />
                        <button type="submit">Entrar</button>
                    </form>
                )}
                
                {activeForm === 'signup' && (
                    <form ref={formRef} onSubmit={e => {e.preventDefault(), handleSignup(), setActiveForm(null)}}>
                        <input name="username" type="text" placeholder="Nome de usuário" defaultValue="" onChange={e => setSignupDTO({...signupDTO, name: e.target.value})} required />
                        <input name="email" type="email" placeholder="E-mail" defaultValue="" onChange={e => setSignupDTO({...signupDTO, email: e.target.value})} required />
                        <input name="password" type="password" placeholder="Senha" defaultValue="" onChange={e => setSignupDTO({...signupDTO, password: e.target.value})} required />
                        <button type="submit">Registrar</button>
                    </form>
                )}
            </div>
        </div>
    );
}