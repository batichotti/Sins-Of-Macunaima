'use client';
import styles from '@/styles/Profile.module.css';
import { useAuth } from '../_context/_authContext';
import { AuthModal } from '../_lib/_auth';
import { useState, useEffect } from 'react';

export default function Profile() {
    const { user, isAuthenticated } = useAuth();
    const [userDTO, setUserDTO] = useState({ id_user: 0, name: '', email: '', best_run: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function fetchUserData() {
        if (!user?.name) return;
        
        setLoading(true);
        setError('');
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:3001/user/${user.name}`,
                {
                    method: 'GET',
                    headers: { 
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                setUserDTO(data);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Erro ao buscar dados');
            } 
        } catch (error) {
            setError('Erro ao buscar usuário: ' + error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchUserData();
        }
    }, [isAuthenticated, user]);

    return (
        <div className={styles.ProfilePage}>
            {isAuthenticated ? (
                <div className={styles.ProfileContainer}>
                    {loading && <p>Carregando...</p>}
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    
                    <div className={styles.PlayerInfo}>
                        <h2>Estatísticas</h2>
                        <p>Maior Pontuação: {userDTO.best_run}</p>
                        <p>Partidas jogadas: {'N/A'}</p>
                    </div>
                    
                    <div className={styles.AccountInfo}>
                        <h2>Informações da conta</h2>
                        <p>Jogador: {userDTO.name || user?.name}</p>
                        <p>Email: {userDTO.email || user?.email}</p>
                    </div>
                </div>
            ) : (
                <div>
                    <h2>Parece que você não está logado</h2>
                    <h2>Inicie sessão ou cadastre-se agora</h2>
                    <AuthModal />
                </div>
            )}
        </div>
    );
}