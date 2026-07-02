# Comparador de Modelos - SPA (Single-Page Application)

Este é um projeto pronto e estruturado que reorganiza o protótipo de auditoria de bulas de defensivos agrícolas em uma arquitetura limpa de **Single-Page Application (SPA)** usando apenas **HTML, CSS e JavaScript puros (Vanilla)**.

---

## 🚀 Como Executar Localmente

Como o projeto utiliza **JavaScript ES Modules (`type="module"`)** e **`fetch` dinâmico** para carregar os fragmentos de visualização (`views/`), os navegadores modernos bloqueiam o carregamento direto abrindo o arquivo pelo protocolo `file://` devido a políticas de segurança (CORS).

Portanto, **é necessário executar o projeto utilizando um servidor web local**. Aqui estão as opções mais simples:

### Opção 1: Extensão Live Server (Recomendado se usar VS Code)
1. Instale a extensão **Live Server** no VS Code.
2. Abra a pasta do projeto no VS Code.
3. Clique com o botão direito no `index.html` e selecione **Open with Live Server**.

### Opção 2: Python (Instalado na maioria dos computadores)
Execute um dos comandos abaixo no terminal dentro da pasta do projeto:

```bash
# Python 3
python -m http.server 8000
```
Depois abra o navegador e acesse: [http://localhost:8000](http://localhost:8000)

### Opção 3: Node.js (se instalado)
Execute no terminal:
```bash
# Instala e roda um servidor instantaneamente
npx serve .
```

---

## 📂 Estrutura do Projeto

Abaixo está a organização dos arquivos gerados:

```
Testes-Internos/
│
├── index.html              # Entrada principal (Casca SPA com cabeçalho, estatísticas e main)
├── index.html.bak          # Cópia de segurança do protótipo original empacotado
│
├── css/
│   ├── global.css          # Design System, variáveis HSL, reset e estilos do cabeçalho
│   ├── modelo1.css         # Estilização exclusiva do Modelo 1 (Visualização em Cards)
│   └── modelo2.css         # Estilização do Modelo 2 (Tabela densa + Gaveta lateral)
│
├── js/
│   ├── data.js             # Fonte unificada dos dados (ALTERACOES, NOVAS, EXCLUSOES)
│   ├── router.js           # Gerenciador de navegação e histórico (popstate/pushState)
│   └── app.js              # Controlador de estado global, reatividade e filtros
│
└── views/
    ├── modelo1.html        # Estrutura HTML do Modelo 1 (Cards com Diffs)
    └── modelo2.html        # Estrutura HTML do Modelo 2 (Tabela com Gaveta lateral)
```

---

## 🛠️ Detalhes da Arquitetura

1. **Roteamento SPA Dinâmico (`js/router.js`):**
   - Utiliza a API `window.history.pushState` para alterar a URL na barra de navegação sem recarregar a página.
   - Sincroniza o estado baseado em query parameters (ex: `?modelo=1` e `?modelo=2`), garantindo que o botão voltar/avançar funcione corretamente e seja 100% compatível com deploys estáticos como **GitHub Pages**.

2. **Gerenciamento de Estado Reativo (`js/app.js`):**
   - Centraliza o estado dos filtros (cultura, classificação, busca de pragas), abas de navegação ativas e as decisões tomadas pelo usuário (Aceitar/Rejeitar/Manter).
   - Ao alterar qualquer elemento na tela ou tomar uma decisão, o estado é atualizado e o DOM é re-renderizado instantaneamente.

3. **Separação de Views Dinâmicas (`views/`):**
   - As estruturas HTML específicas dos modelos foram separadas em arquivos de templates que são puxados dinamicamente via `fetch`, mantendo a casca principal do `index.html` limpa e modular.

4. **Estilo Premium HSL (`css/global.css`):**
   - Utiliza a fonte **Inter** importada diretamente.
   - Paleta de cores premium baseada em HSL com tons elegantes de verde floresta (`#134E39`), verde ativo (`#2ABB65`), laranja para notas (`#C67B41`), vermelho para remoções (`#C0392B`) e cinza suave (`#EDEFEE`) com sombras refinadas.
