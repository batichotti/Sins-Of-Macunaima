import styles from '@/styles/MainMenu.module.css';
import layoutStyles from '@/styles/layout.module.css';
import { useRef, useState, useEffect } from 'react';
import { useAuth } from '../_context/_authContext';

interface PasswordRequirementsProps {
  password: string;
  isHeader?: boolean;
}

export function PasswordRequirements({ password, isHeader = false }: PasswordRequirementsProps) {
  const requirements = [
    { label: 'Ao menos 8 caracteres', valid: password.length >= 8 },
    { label: 'Ao menos 1 letra maiúscula', valid: /[A-Z]/.test(password) },
    { label: 'Ao menos 1 letra minúscula', valid: /[a-z]/.test(password) },
    { label: 'Ao menos 1 número', valid: /\d/.test(password) },
  ];

  const requirementsClass = isHeader ? layoutStyles.requirements : styles.requirements;
  const validClass = isHeader ? layoutStyles.valid : styles.valid;
  const invalidClass = isHeader ? layoutStyles.invalid : styles.invalid;

  return (
    <ul className={requirementsClass}>
      {requirements.map((req) => (
        <li key={req.label} className={req.valid ? validClass : invalidClass}>
          {req.valid ? '✔' : '✖'} {req.label}
        </li>
      ))}
    </ul>
  );
}

interface signinDTO {
    email: string,
    password: string
}

interface signupDTO extends signinDTO {
    name: string
}

export function AuthModal({ isHeader = false }: { isHeader?: boolean }) {
    const [activeForm, setActiveForm] = useState<'signin' | 'signup' | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { login } = useAuth();

    const [signupDTO, setSignupDTO] = useState<signupDTO>({name: '', email: '', password: ''});
    const [signinDTO, setSigninDTO] = useState<signinDTO>({email: '', password: ''});
    const [mounted, setMounted] = useState(false);

    const containerClass = isHeader ? layoutStyles.AuthModalContainer : styles.AuthModalContainer;
    const buttonsClass = isHeader ? layoutStyles.AuthModalButtons : styles.AuthModalButtons;
    const contentClass = isHeader ? layoutStyles.AuthModalContent : styles.AuthModalContent;

    // Ensure component is mounted
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Reset form when switching between forms
    useEffect(() => {
        if (activeForm === 'signin') {
            setSigninDTO({email: '', password: ''});
        } else if (activeForm === 'signup') {
            setSignupDTO({name: '', email: '', password: ''});
        }
    }, [activeForm]);

    // Close form when clicking outside (only for header)
    useEffect(() => {
        if (!isHeader || !activeForm || !mounted) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('[data-auth-modal]')) {
                setActiveForm(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isHeader, activeForm, mounted]);

    if (!mounted) {
        return (
            <div className={containerClass}>
                <div className={buttonsClass}>
                    <button disabled>Entrar</button>
                    <button disabled>Registrar</button>
                </div>
            </div>
        );
    }

    async function handleSignin(e: React.FormEvent) {
        e.preventDefault();
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

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
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
        <div className={containerClass} data-auth-modal>
            <div className={buttonsClass}>
                <button onClick={() => { 
                    setActiveForm(activeForm === 'signin' ? null : 'signin');
                }}>
                    Entrar
                </button>
                <button onClick={() => { 
                    setActiveForm(activeForm === 'signup' ? null : 'signup');
                }}>
                    Registrar
                </button>
            </div>

            {activeForm && (
                <div className={contentClass}>
                    {activeForm === 'signin' && (
                        <form ref={formRef} onSubmit={handleSignin}>
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="E-mail" 
                                value={signinDTO.email}
                                onChange={e => setSigninDTO({...signinDTO, email: e.target.value})} 
                                required 
                            />
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="Senha" 
                                value={signinDTO.password}
                                onChange={e => setSigninDTO({...signinDTO, password: e.target.value})} 
                                required 
                            />
                            <button type="submit">Entrar</button>
                        </form>
                    )}

                    {activeForm === 'signup' && (
                        <div>
                            <form ref={formRef} onSubmit={handleSignup}>
                                <input 
                                    name="username" 
                                    type="text" 
                                    placeholder="Nome de usuário" 
                                    value={signupDTO.name}
                                    onChange={e => setSignupDTO({...signupDTO, name: e.target.value})} 
                                    minLength={3} 
                                    required 
                                />
                                <input 
                                    name="email" 
                                    type="email" 
                                    placeholder="E-mail" 
                                    value={signupDTO.email}
                                    onChange={e => setSignupDTO({...signupDTO, email: e.target.value})} 
                                    required 
                                />
                                <input 
                                    name="password" 
                                    type="password" 
                                    placeholder="Senha" 
                                    value={signupDTO.password}
                                    onChange={e => setSignupDTO({...signupDTO, password: e.target.value})} 
                                    minLength={8} 
                                    required 
                                />
                                <PasswordRequirements password={signupDTO.password} isHeader={isHeader} />
                                <button type="submit">Registrar</button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
