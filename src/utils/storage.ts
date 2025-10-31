// Utilitário para gerenciar storage isolado por aba
// Usa sessionStorage para manter usuários diferentes em abas diferentes

export const storage = {
  // Salvar dados do usuário
  setUserId(userId: string) {
    sessionStorage.setItem("userId", userId);
  },

  getUserId(): string | null {
    return sessionStorage.getItem("userId");
  },

  setUserEmail(email: string) {
    sessionStorage.setItem("userEmail", email);
  },

  getUserEmail(): string | null {
    return sessionStorage.getItem("userEmail");
  },

  setUserName(name: string) {
    sessionStorage.setItem("userName", name);
  },

  getUserName(): string | null {
    return sessionStorage.getItem("userName");
  },

  // Dados temporários para signup
  setTempEmail(email: string) {
    sessionStorage.setItem("tempEmail", email);
  },

  getTempEmail(): string | null {
    return sessionStorage.getItem("tempEmail");
  },

  setTempPassword(password: string) {
    sessionStorage.setItem("tempPassword", password);
  },

  getTempPassword(): string | null {
    return sessionStorage.getItem("tempPassword");
  },

  removeTempCredentials() {
    sessionStorage.removeItem("tempEmail");
    sessionStorage.removeItem("tempPassword");
  },

  // Limpar todos os dados do usuário
  clearUserData() {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userProfile");
    sessionStorage.removeItem("userInterests");
  },

  // Verificar se há usuário logado
  isLoggedIn(): boolean {
    return !!this.getUserId();
  },
};
