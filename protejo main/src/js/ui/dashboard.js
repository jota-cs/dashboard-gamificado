import { XPService } from '../services/xpService.js';

export const DashboardUI = {
    // Mapeamento dos elementos do DOM
    elements: {
        levelBadge: document.querySelector('.level-badge'),
        xpText: document.querySelector('.xp-info span:nth-child(2)'),
        xpBarFill: document.querySelector('.xp-bar-fill'),
        completeButtons: document.querySelectorAll('.btn-complete')
    },

    init() {
        this.updateScreen(XPService.getCurrentStatus());
        this.bindEvents();
    },

    bindEvents() {
        // Adiciona o evento de clique em todos os botões de "Concluir"
        this.elements.completeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Em um cenário real, pegaríamos o valor do botão ou do card
                const xpGanho = 500; 
                
                // 1. Atualiza a lógica (Cérebro)
                const newStatus = XPService.addXP(xpGanho);
                
                // 2. Atualiza a tela (View)
                this.updateScreen(newStatus);

                // 3. Feedback visual no botão
                const btn = e.target;
                btn.textContent = "Concluído! ✔️";
                btn.disabled = true;
                btn.style.backgroundColor = "var(--bg-surface-hover)";
                btn.style.color = "var(--text-secondary)";

                if (newStatus.leveledUp) {
                    this.showLevelUpAnimation(newStatus.currentLevel);
                }
            });
        });
    },

    updateScreen(status) {
        // Atualiza os textos
        this.elements.levelBadge.textContent = `Lvl ${status.currentLevel}`;
        this.elements.xpText.textContent = `${status.currentXP} / ${status.xpNeeded} XP`;
        
        // Atualiza a barra com animação CSS
        this.elements.xpBarFill.style.width = `${status.progressPercentage}%`;
    },

    showLevelUpAnimation(newLevel) {
        // Uma simples animação para dar satisfação ao usuário (Gamificação pura)
        alert(`🎉 Parabéns! Você alcançou o Nível ${newLevel}!`);
        // No futuro, aqui entra um modal bonito ou confetes na tela
    }
};