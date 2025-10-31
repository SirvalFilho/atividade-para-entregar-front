import axios from "axios";

// Configuração global do Axios
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3003";

// Configurar base URL
axios.defaults.baseURL = API_BASE_URL;

// Configurar headers padrão
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

// Interceptor de requisição
axios.interceptors.request.use(
  (config) => {
    // Adicionar token de autenticação se existir
    // IMPORTANTE: Usa sessionStorage para isolar abas diferentes
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      config.headers["user-token"] = userId;
    }

    return config;
  },
  (error) => {
    console.error("❌ Erro na requisição:", error);
    return Promise.reject(error);
  }
);

// Interceptor de resposta
axios.interceptors.response.use(
  (response) => {
    console.log("✅ Resposta:", response.config.url, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      // O servidor respondeu com um código de erro
      console.error(
        "❌ Erro do servidor:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error("❌ Sem resposta do servidor:", error.request);
      console.error("URL tentada:", error.config?.url);
      console.error("Base URL configurada:", API_BASE_URL);
    } else {
      // Algo aconteceu ao configurar a requisição
      console.error("❌ Erro ao configurar requisição:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axios;
