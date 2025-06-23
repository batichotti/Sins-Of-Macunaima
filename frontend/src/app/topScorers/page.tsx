'use client';
export default function topScorers() {
    return (
        <div>
            <h1>Top Scorers</h1>
            <p>Esta página está em construção.</p>
            <p>Em breve, você poderá ver os melhores jogadores e suas pontuações!</p>

            <button
                onClick={
                    async () => {
                        try {
                            const response = await fetch('http://localhost:3001/user/top');
                            const data = await response.text();
                            alert(data);
                        } catch (error) {
                            alert('Erro ao buscar top scorers! ' + error);
                        }
                    }
                }
            >Top Scorers</button>
        </div>
    );
}