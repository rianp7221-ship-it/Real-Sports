async function fetchMatches() {
    if (USE_REAL_API && API_KEY !== "219415e7d2ff117cc0e96919766c5479") {
        try {
            // Obtém a data de hoje no formato YYYY-MM-DD
            const today = new Date().toISOString().split('T')[0];
            
            // Puxa todos os jogos agendados para hoje
            const response = await fetch(`https://v3.football.api-sports.io/fixtures?date=${today}`, {
                method: "GET",
                headers: {
                    "x-apisports-key": API_KEY
                }
            });
            const data = await response.json();
            
            if (data.response && data.response.length > 0) {
                return data.response.slice(0, 15).map(match => ({
                    id: match.fixture.id,
                    league: match.league.name,
                    time: match.fixture.status.short === '1H' || match.fixture.status.short === '2H' ? match.fixture.status.elapsed + "'" : match.fixture.date.slice(11, 16),
                    home: match.teams.home.name,
                    away: match.teams.away.name,
                    score: match.goals.home !== null ? `${match.goals.home} - ${match.goals.away}` : "vs",
                    odds: { 
                        home: Number((1.5 + (match.fixture.id % 5) * 0.1).toFixed(2)), 
                        draw: 3.20, 
                        away: Number((2.1 + (match.fixture.id % 4) * 0.15).toFixed(2)) 
                    }
                }));
            } else {
                return getFallbackData();
            }
        } catch (error) {
            console.error("Erro ao ligar à API-Football.", error);
            return getFallbackData();
        }
    } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getFallbackData();
    }
}
