export class Router {
  constructor(onChangeCallback) {
    this.onChange = onChangeCallback;
    
    // Escuta eventos de navegação do navegador (botão voltar/avançar)
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });
  }

  // Inicializa o roteador carregando a rota atual
  init() {
    this.handleRoute();
  }

  // Trata a rota lendo os query parameters da URL
  handleRoute() {
    const params = new URLSearchParams(window.location.search);
    let model = parseInt(params.get('modelo'));
    
    // Default para o modelo 1 (Cards) se não especificado ou se for inválido
    if (isNaN(model) || (model !== 1 && model !== 2)) {
      model = 1;
    }
    
    this.onChange(model);
  }

  // Navega para um modelo específico alterando a URL sem recarregar
  navigateTo(modelNumber) {
    const params = new URLSearchParams(window.location.search);
    params.set('modelo', modelNumber);
    
    // Constrói a nova URL estática
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    
    window.history.pushState({ model: modelNumber }, '', newUrl);
    this.onChange(modelNumber);
  }
}
