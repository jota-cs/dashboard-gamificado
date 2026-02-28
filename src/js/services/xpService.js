/**
 * Serviço responsável pelas regras de Gamificação (XP e Níveis)
 */
export const XPService = {
    // Estado inicial simulado (isso viria do seu Storage ou API)
    state: {
        currentXP: 1200,
        currentLevel: 1,
        baseXPPerLevel: 1000,
        multiplier: 1.5 // Cada nível exige 50% a mais de XP que o anterior
    },

    // Calcula o XP necessário para o PRÓXIMO nível
    getXPForNextLevel(level) {
        return Math.floor(this.state.baseXPPerLevel * Math.pow(this.state.multiplier, level - 1));
    },

    // Adiciona XP e verifica se subiu de nível
    addXP(amount) {
        this.state.currentXP += amount;
        let xpNeeded = this.getXPForNextLevel(this.state.currentLevel);

        let leveledUp = false;

        // Loop caso o usuário ganhe muito XP de uma vez e suba múltiplos níveis
        while (this.state.currentXP >= xpNeeded) {
            this.state.currentLevel++;
            this.state.currentXP -= xpNeeded; // Reseta o XP da barra atual
            xpNeeded = this.getXPForNextLevel(this.state.currentLevel);
            leveledUp = true;
        }

        return {
            leveledUp: leveledUp,
            currentXP: this.state.currentXP,
            currentLevel: this.state.currentLevel,
            xpNeeded: xpNeeded,
            progressPercentage: (this.state.currentXP / xpNeeded) * 100
        };
    },

    // Retorna o status atual sem modificar nada
    getCurrentStatus() {
        const xpNeeded = this.getXPForNextLevel(this.state.currentLevel);
        return {
            currentXP: this.state.currentXP,
            currentLevel: this.state.currentLevel,
            xpNeeded: xpNeeded,
            progressPercentage: (this.state.currentXP / xpNeeded) * 100
        };
    }
};