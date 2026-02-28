/**
 * /js/data/storage.js
 * Camada de abstração de dados. 
 * Isola a persistência para facilitar futura migração para API REST/GraphQL.
 */

export const StorageService = {
    // Hoje salva no LocalStorage. No futuro, aqui vai um POST para a API.
    async saveTask(taskData) {
        try {
            const tasks = this.getAllTasks();
            tasks.push(taskData);
            localStorage.setItem('@app:tasks', JSON.stringify(tasks));
            return { success: true, data: taskData };
        } catch (error) {
            console.error("Erro ao salvar tarefa:", error);
            return { success: false, error };
        }
    },

    // Hoje lê do LocalStorage. No futuro, aqui vai um GET para a API.
    getAllTasks() {
        const data = localStorage.getItem('@app:tasks');
        return data ? JSON.parse(data) : [];
    },
    
    // O mesmo princípio se aplica para atualizar XP do usuário
    async updateUserProfile(userData) {
        localStorage.setItem('@app:user', JSON.stringify(userData));
        return { success: true, data: userData };
    }
};