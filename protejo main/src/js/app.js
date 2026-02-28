/**
 * APP.JS - ARQUITETURA MODULAR DO MVP
 * Separado em Storage (Dados), Engine (Lógica) e UI (Interface)
 */

// ==========================================
// 1. CAMADA DE DADOS (Simulando o Banco / SaaS)
// ==========================================
const Storage = {
    savePlayerState(state) {
        localStorage.setItem('@evolua:player', JSON.stringify(state));
    },
    
    loadPlayerState() {
        const data = localStorage.getItem('@evolua:player');
        // Se não houver dados, retorna o estado inicial (Novo Usuário)
        if (!data) {
            return {
                level: 1,
                currentXP: 0,
                totalXPGained: 0,
                completedTasks: []
            };
        }
        return JSON.parse(data);
    }
};

// ==========================================
// 2. CAMADA DE LÓGICA (O Motor de Gamificação)
// ==========================================
const Engine = {
    state: Storage.loadPlayerState(),
    baseXP: 1000,       // XP necessário para ir do Lvl 1 para o Lvl 2
    multiplier: 1.2,    // Cada nível fica 20% mais difícil

    // Calcula quanto XP é necessário para o PRÓXIMO nível
    getRequiredXPForNextLevel() {
        // Fórmula RPG: Base * (Multiplicador ^ (Nível - 1))
        return Math.floor(this.baseXP * Math.pow(this.multiplier, this.state.level - 1));
    },

    // Processa o ganho de XP e verifica level up
    addXP(amount, taskId) {
        // Verifica se a tarefa já foi feita (evita duplo clique/fraude simples)
        if (this.state.completedTasks.includes(taskId)) return false;

        this.state.currentXP += amount;
        this.state.totalXPGained += amount;
        this.state.completedTasks.push(taskId);

        let requiredXP = this.getRequiredXPForNextLevel();
        let leveledUp = false;

        // Loop: Se ganhar muito XP de uma vez, pode subir vários níveis
        while (this.state.currentXP >= requiredXP) {
            this.state.currentXP -= requiredXP; // Subtrai o custo do nível
            this.state.level++;                 // Sobe o nível
            requiredXP = this.getRequiredXPForNextLevel(); // Recalcula o próximo alvo
            leveledUp = true;
        }

        Storage.savePlayerState(this.state);
        
        return { leveledUp, level: this.state.level };
    }
};

// ==========================================
// 3. CAMADA DE INTERFACE (Controlador do DOM)
// ==========================================
const UI = {
    elements: {
        xpBar: document.getElementById('xpBar'),
        xpText: document.getElementById('xpText'),
        levelDisplay: document.getElementById('levelDisplay'),
        buttons: document.querySelectorAll('.btn-complete')
    },

    init() {
        this.updateScreen();
        this.bindEvents();
    },

    bindEvents() {
        this.elements.buttons.forEach((btn, index) => {
            const taskId = `task_${index}`; // Simulando um ID único vindo do banco

            // Se a tarefa já foi feita no passado (lido do LocalStorage), desabilita o botão
            if (Engine.state.completedTasks.includes(taskId)) {
                this.disableButton(btn);
            }

            btn.addEventListener('click', () => {
                const xpReward = parseInt(btn.getAttribute('data-xp'));
                const result = Engine.addXP(xpReward, taskId);

                if (result !== false) {
                    this.disableButton(btn);
                    this.updateScreen();

                    if (result.leveledUp) {
                        this.playLevelUpEffect(result.level);
                    }
                }
            });
        });
    },

    disableButton(btn) {
        btn.textContent = "✔ Concluído";
        btn.disabled = true;
    },

    updateScreen() {
        const currentXP = Engine.state.currentXP;
        const requiredXP = Engine.getRequiredXPForNextLevel();
        
        // Calcula a porcentagem para a barra (limitado a 100%)
        const percentage = Math.min((currentXP / requiredXP) * 100, 100);

        // Atualiza HTML
        this.elements.xpText.textContent = `${currentXP} / ${requiredXP} XP`;
        this.elements.levelDisplay.textContent = `Lvl ${Engine.state.level}`;
        this.elements.xpBar.style.width = `${percentage}%`;
    },

    playLevelUpEffect(newLevel) {
        const badge = this.elements.levelDisplay;
        
        // Efeito de brilho intenso "Red Dark"
        badge.style.boxShadow = "0 0 40px #e11d48";
        badge.style.transform = "scale(1.3)";
        badge.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        
        setTimeout(() => {
            badge.style.boxShadow = "0 0 15px rgba(225, 29, 72, 0.4)";
            badge.style.transform = "scale(1)";
            alert(`🎬 Corte perfeito! Você evoluiu para o Nível ${newLevel}!`);
        }, 600);
    }
};

// Inicializa a aplicação quando o navegador terminar de ler o HTML
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
});