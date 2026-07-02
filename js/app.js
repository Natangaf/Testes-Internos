import { ALTERACOES, NOVAS, EXCLUSOES } from './data.js';
import { Router } from './router.js';

// Estado global da aplicação
const state = {
  activeModel: 1,
  activeTab: 'alteracoes',
  filters: {
    cultura: 'Todas',
    classificacao: 'Todas',
    search: ''
  },
  // Armazena as decisões do usuário: 'accepted' ou 'rejected'
  // Chaves: 'itemId:fieldIdx' para alterações, ou 'itemId' para novas/exclusões
  decisions: {},
  openRowId: null
};

// Instancia o roteador
let router;

// Inicializa a aplicação ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
  router = new Router((model) => {
    state.activeModel = model;
    state.openRowId = null; // Reseta seleção de linha ao trocar modelo
    carregarView();
  });
  
  // Vincula botões do Header
  document.getElementById('btn-modelo1').addEventListener('click', () => router.navigateTo(1));
  document.getElementById('btn-modelo2').addEventListener('click', () => router.navigateTo(2));
  
  // Inicializa a rota
  router.init();
});

// Carrega o fragmento HTML do modelo ativo
async function carregarView() {
  const container = document.getElementById('app');
  
  // Atualiza classes ativas dos botões de modelo no header
  document.getElementById('btn-modelo1').classList.toggle('active', state.activeModel === 1);
  document.getElementById('btn-modelo2').classList.toggle('active', state.activeModel === 2);
  
  try {
    const response = await fetch(`views/modelo${state.activeModel}.html`);
    if (!response.ok) throw new Error('Falha ao carregar view');
    const html = await response.text();
    container.innerHTML = html;
    
    // Configura os event listeners específicos da view recém-carregada
    inicializarListenersView();
    
    // Executa a primeira renderização
    render();
  } catch (error) {
    console.error('Erro ao carregar view:', error);
    container.innerHTML = `<div style="padding: 36px; text-align: center; color: var(--danger-color); font-weight: 600;">
      Erro ao carregar a página. Por favor, certifique-se de estar rodando em um servidor local.
    </div>`;
  }
}

// Vincula listeners para selects, search input e tabs da view atual
function inicializarListenersView() {
  // Tabs
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      state.activeTab = tab.dataset.tab;
      state.openRowId = null; // Reseta seleção
      
      // Atualiza tabs ativas visualmente
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      
      // Esconde o filtro de classificação se não estiver na aba de alterações
      const filterClassificacao = document.getElementById('filter-classificacao');
      if (filterClassificacao) {
        filterClassificacao.style.display = state.activeTab === 'alteracoes' ? 'block' : 'none';
      }
      
      render();
    });
  });
  
  // Filtros
  const selectCultura = document.getElementById('filter-cultura');
  if (selectCultura) {
    selectCultura.value = state.filters.cultura;
    selectCultura.addEventListener('change', (e) => {
      state.filters.cultura = e.target.value;
      render();
    });
  }
  
  const selectClassificacao = document.getElementById('filter-classificacao');
  if (selectClassificacao) {
    selectClassificacao.value = state.filters.classificacao;
    selectClassificacao.addEventListener('change', (e) => {
      state.filters.classificacao = e.target.value;
      render();
    });
  }
  
  const inputSearch = document.getElementById('filter-search');
  if (inputSearch) {
    inputSearch.value = state.filters.search;
    inputSearch.addEventListener('input', (e) => {
      state.filters.search = e.target.value;
      render();
    });
  }
  
  // Correção de exibição inicial do filtro classificação se necessário
  const filterClassificacao = document.getElementById('filter-classificacao');
  if (filterClassificacao) {
    filterClassificacao.style.display = state.activeTab === 'alteracoes' ? 'block' : 'none';
  }
}

// Filtra os dados conforme o estado atual
function filtrarDados() {
  const q = state.filters.search.toLowerCase();
  
  const matchesSearch = (item) => {
    if (!q) return true;
    return item.praga.toLowerCase().includes(q) || item.cientifico.toLowerCase().includes(q);
  };
  
  const matchesCultura = (item) => {
    return state.filters.cultura === 'Todas' || item.cultura === state.filters.cultura;
  };
  
  if (state.activeTab === 'alteracoes') {
    return ALTERACOES
      .filter(matchesCultura)
      .filter(matchesSearch)
      .filter(item => {
        if (state.filters.classificacao === 'Todas') return true;
        return item.fields.some(f => f.tipo === state.filters.classificacao);
      });
  } else if (state.activeTab === 'novas') {
    return NOVAS.filter(matchesCultura).filter(matchesSearch);
  } else if (state.activeTab === 'exclusoes') {
    return EXCLUSOES.filter(matchesCultura).filter(matchesSearch);
  }
  return [];
}

// Função de renderização reativa
function render() {
  const dadosFiltrados = filtrarDados();
  
  // Atualiza contadores nas abas (badges)
  atualizarBadgesAbas();
  
  // Atualiza o texto descritivo de contagem
  const labelTab = state.activeTab === 'alteracoes' ? 'alterações sugeridas' : 
                   state.activeTab === 'novas' ? 'novas entradas' : 'possíveis exclusões';
  const countInfo = document.getElementById('count-info');
  if (countInfo) {
    countInfo.textContent = `Mostrando ${dadosFiltrados.length} relações com ${labelTab}`;
  }
  
  // Renderiza conforme o modelo ativo
  if (state.activeModel === 1) {
    renderModelo1(dadosFiltrados);
  } else {
    renderModelo2(dadosFiltrados);
  }
}

// Atualiza contagens nas badges de cada aba
function atualizarBadgesAbas() {
  const matchesCultura = (item) => state.filters.cultura === 'Todas' || item.cultura === state.filters.cultura;
  const q = state.filters.search.toLowerCase();
  const matchesSearch = (item) => !q || item.praga.toLowerCase().includes(q) || item.cientifico.toLowerCase().includes(q);
  
  const countAlt = ALTERACOES.filter(matchesCultura).filter(matchesSearch).length;
  const countNov = NOVAS.filter(matchesCultura).filter(matchesSearch).length;
  const countExc = EXCLUSOES.filter(matchesCultura).filter(matchesSearch).length;
  
  const badgeAlt = document.getElementById('badge-alteracoes');
  const badgeNov = document.getElementById('badge-novas');
  const badgeExc = document.getElementById('badge-exclusoes');
  
  if (badgeAlt) badgeAlt.textContent = countAlt.toLocaleString('pt-BR');
  if (badgeNov) badgeNov.textContent = countNov.toLocaleString('pt-BR');
  if (badgeExc) badgeExc.textContent = countExc.toLocaleString('pt-BR');
}

// ==========================================
// RENDERIZADORES DO MODELO 1 (CARDS)
// ==========================================
function renderModelo1(dados) {
  const container = document.getElementById('cards-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (dados.length === 0) {
    container.innerHTML = `<div style="padding: 40px; text-align: center; color: var(--text-muted); font-size: 14px; background: #fff; border-radius: 12px; border: 1px solid var(--border-color);">
      Nenhum item encontrado com os filtros selecionados.
    </div>`;
    return;
  }
  
  dados.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card-item';
    
    if (state.activeTab === 'alteracoes') {
      card.appendChild(criarCardAlteracoes(item));
    } else if (state.activeTab === 'novas') {
      card.appendChild(criarCardNovas(item));
    } else if (state.activeTab === 'exclusoes') {
      card.appendChild(criarCardExclusoes(item));
    }
    
    container.appendChild(card);
  });
}

function criarCardAlteracoes(item) {
  const wrapper = document.createElement('div');
  
  // Header do Card
  const header = document.createElement('div');
  header.className = 'card-header';
  
  const titleContainer = document.createElement('div');
  titleContainer.innerHTML = `
    <div class="card-title">${item.cultura} · ${item.praga}</div>
    <div class="card-subtitle">${item.cientifico} · Exceção: ${item.excecao || 'Nenhuma'}</div>
  `;
  
  const actions = document.createElement('div');
  actions.className = 'card-header-actions';
  
  // Conta quantos campos correspondem à classificação filtrada
  const filteredFields = item.fields.filter(f => state.filters.classificacao === 'Todas' || f.tipo === state.filters.classificacao);
  
  actions.innerHTML = `<span class="card-fields-count">${filteredFields.length} campos</span>`;
  
  const btnAcceptAll = document.createElement('button');
  btnAcceptAll.className = 'btn nav-btn';
  btnAcceptAll.style.cssText = 'background: var(--accent-light); color: var(--primary-color); border: 1px solid #C7E8D3; padding: 6px 12px; font-size: 12px; height: 32px;';
  btnAcceptAll.textContent = 'Aceitar tudo';
  btnAcceptAll.addEventListener('click', () => {
    item.fields.forEach((_, idx) => {
      state.decisions[`${item.id}:${idx}`] = 'accepted';
    });
    render();
  });
  
  const btnRejectAll = document.createElement('button');
  btnRejectAll.className = 'btn nav-btn';
  btnRejectAll.style.cssText = 'background: var(--danger-light); color: var(--danger-color); border: 1px solid #F3D2CE; padding: 6px 12px; font-size: 12px; height: 32px;';
  btnRejectAll.textContent = 'Rejeitar tudo';
  btnRejectAll.addEventListener('click', () => {
    item.fields.forEach((_, idx) => {
      state.decisions[`${item.id}:${idx}`] = 'rejected';
    });
    render();
  });
  
  actions.appendChild(btnAcceptAll);
  actions.appendChild(btnRejectAll);
  
  header.appendChild(titleContainer);
  header.appendChild(actions);
  wrapper.appendChild(header);
  
  // Lista de campos com Diffs
  const fieldsList = document.createElement('div');
  fieldsList.className = 'diff-fields-list';
  
  item.fields.forEach((field, idx) => {
    // Filtro de classificação por campo
    if (state.filters.classificacao !== 'Todas' && field.tipo !== state.filters.classificacao) {
      return;
    }
    
    const decisionKey = `${item.id}:${idx}`;
    const currentDecision = state.decisions[decisionKey];
    
    const row = document.createElement('div');
    row.className = 'field-diff-row';
    
    // Cabeçalho do campo
    const fieldHeader = document.createElement('div');
    fieldHeader.className = 'field-diff-header';
    
    const badgeClass = field.tipo === 'obrigatoria' ? 'badge-warning' : 'badge-secondary';
    const labelBadge = field.tipo === 'obrigatoria' ? 'ALTERAÇÃO OBRIGATÓRIA' : 'REVISÃO NECESSÁRIA';
    
    fieldHeader.innerHTML = `
      <span class="field-label">${field.label}</span>
      <span class="badge ${badgeClass}">${labelBadge}</span>
    `;
    row.appendChild(fieldHeader);
    
    // Blocos de Comparação
    const blocks = document.createElement('div');
    blocks.className = 'diff-blocks';
    
    // Atual (Banco)
    const blockActual = document.createElement('div');
    blockActual.className = 'diff-block';
    blockActual.innerHTML = `
      <div class="diff-block-title">Atual (Banco)</div>
      <div class="diff-block-val">${field.atual || 'Não informado'}</div>
    `;
    blocks.appendChild(blockActual);
    
    // Seta indicativa
    const arrow = document.createElement('div');
    arrow.className = 'diff-arrow';
    arrow.textContent = '→';
    blocks.appendChild(arrow);
    
    // Sugerido (Bula) ou Nota da IA
    const blockSuggested = document.createElement('div');
    if (field.tipo === 'revisao') {
      blockSuggested.className = 'diff-block ia-note';
      blockSuggested.innerHTML = `
        <div class="diff-block-title">Nota da IA</div>
        <div class="diff-block-val">${field.nota}</div>
      `;
    } else {
      blockSuggested.className = 'diff-block suggested';
      blockSuggested.innerHTML = `
        <div class="diff-block-title">Sugerido (Bula)</div>
        <div class="diff-block-val">${field.sugerido || 'Remover valor'}</div>
      `;
    }
    blocks.appendChild(blockSuggested);
    
    // Ações do campo (Check / Cross)
    const fieldActions = document.createElement('div');
    fieldActions.className = 'field-diff-actions';
    
    const btnCheck = document.createElement('button');
    btnCheck.className = `btn-action-circle check`;
    btnCheck.innerHTML = '✓';
    btnCheck.addEventListener('click', () => {
      state.decisions[decisionKey] = currentDecision === 'accepted' ? undefined : 'accepted';
      render();
    });
    
    const btnCross = document.createElement('button');
    btnCross.className = `btn-action-circle cross`;
    btnCross.innerHTML = '✕';
    btnCross.addEventListener('click', () => {
      state.decisions[decisionKey] = currentDecision === 'rejected' ? undefined : 'rejected';
      render();
    });
    
    fieldActions.appendChild(btnCheck);
    fieldActions.appendChild(btnCross);
    blocks.appendChild(fieldActions);
    
    row.appendChild(blocks);
    
    // Exibe faixa com a decisão tomada
    if (currentDecision === 'accepted') {
      const banner = document.createElement('div');
      banner.className = 'decision-banner accepted';
      banner.innerHTML = `<span>✓</span> Sugestão aceita`;
      row.appendChild(banner);
    } else if (currentDecision === 'rejected') {
      const banner = document.createElement('div');
      banner.className = 'decision-banner rejected';
      banner.innerHTML = `<span>✕</span> Rejeitado — mantém valor atual`;
      row.appendChild(banner);
    }
    
    fieldsList.appendChild(row);
  });
  
  wrapper.appendChild(fieldsList);
  return wrapper;
}

function criarCardNovas(item) {
  const wrapper = document.createElement('div');
  const decision = state.decisions[item.id];
  
  // Header
  const header = document.createElement('div');
  header.className = 'new-entry-header';
  header.innerHTML = `
    <div>
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="card-title">${item.cultura} · ${item.praga}</span>
        <span class="badge badge-success">NOVA ENTRADA</span>
      </div>
      <div class="card-subtitle">${item.cientifico} · Fonte: Bula p. ${item.pagina}</div>
    </div>
  `;
  
  // Botões de Ação
  const actions = document.createElement('div');
  actions.className = 'exclusion-actions';
  
  const btnAccept = document.createElement('button');
  btnAccept.className = 'btn';
  btnAccept.style.cssText = 'background: var(--accent-light); color: var(--primary-color); border: 1px solid #C7E8D3; padding: 7px 14px; font-size: 12px;';
  btnAccept.textContent = 'Aceitar';
  btnAccept.addEventListener('click', () => {
    state.decisions[item.id] = decision === 'accepted' ? undefined : 'accepted';
    render();
  });
  
  const btnReject = document.createElement('button');
  btnReject.className = 'btn';
  btnReject.style.cssText = 'background: var(--danger-light); color: var(--danger-color); border: 1px solid #F3D2CE; padding: 7px 14px; font-size: 12px;';
  btnReject.textContent = 'Rejeitar';
  btnReject.addEventListener('click', () => {
    state.decisions[item.id] = decision === 'rejected' ? undefined : 'rejected';
    render();
  });
  
  actions.appendChild(btnAccept);
  actions.appendChild(btnReject);
  header.appendChild(actions);
  wrapper.appendChild(header);
  
  // Detalhes da Nova Entrada
  const grid = document.createElement('div');
  grid.className = 'new-entry-grid';
  grid.innerHTML = `
    <div class="new-entry-info-item"><div class="new-entry-info-label">DOSAGEM</div><div class="new-entry-info-val">${item.dose}</div></div>
    <div class="new-entry-info-item"><div class="new-entry-info-label">MODALIDADE</div><div class="new-entry-info-val">${item.modalidade}</div></div>
    <div class="new-entry-info-item"><div class="new-entry-info-label">EXCEÇÕES</div><div class="new-entry-info-val">${item.excecoes}</div></div>
    <div class="new-entry-info-item"><div class="new-entry-info-label">CALDA TERRESTRE</div><div class="new-entry-info-val">${item.caldaTerrestre}</div></div>
    <div class="new-entry-info-item" style="grid-column: span 2;"><div class="new-entry-info-label">CALDA AÉREA</div><div class="new-entry-info-val">${item.caldaAerea}</div></div>
  `;
  wrapper.appendChild(grid);
  
  // Mensagem da Decisão
  if (decision === 'accepted') {
    const banner = document.createElement('div');
    banner.className = 'decision-banner accepted';
    banner.innerHTML = `<span>✓</span> Entrada aceita — será criada no banco`;
    wrapper.appendChild(banner);
  } else if (decision === 'rejected') {
    const banner = document.createElement('div');
    banner.className = 'decision-banner rejected';
    banner.innerHTML = `<span>✕</span> Rejeitado — não será criado`;
    wrapper.appendChild(banner);
  }
  
  return wrapper;
}

function criarCardExclusoes(item) {
  const wrapper = document.createElement('div');
  const decision = state.decisions[item.id];
  
  // Header
  const header = document.createElement('div');
  header.className = 'exclusion-header';
  header.innerHTML = `
    <div>
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="card-title">${item.cultura} · ${item.praga}</span>
        <span class="badge badge-danger">POSSÍVEL EXCLUSÃO</span>
      </div>
      <div class="card-subtitle">${item.cientifico}</div>
    </div>
  `;
  
  // Ações
  const actions = document.createElement('div');
  actions.className = 'exclusion-actions';
  
  const btnKeep = document.createElement('button');
  btnKeep.className = 'btn';
  btnKeep.style.cssText = 'background: #fff; border: 1px solid var(--border-color); color: var(--text-light); padding: 7px 14px; font-size: 12px;';
  btnKeep.textContent = 'Manter';
  btnKeep.addEventListener('click', () => {
    state.decisions[item.id] = decision === 'accepted' ? undefined : 'accepted';
    render();
  });
  
  const btnRemove = document.createElement('button');
  btnRemove.className = 'btn';
  btnRemove.style.cssText = 'background: var(--danger-light); color: var(--danger-color); border: 1px solid #F3D2CE; padding: 7px 14px; font-size: 12px;';
  btnRemove.textContent = 'Remover';
  btnRemove.addEventListener('click', () => {
    state.decisions[item.id] = decision === 'rejected' ? undefined : 'rejected';
    render();
  });
  
  actions.appendChild(btnKeep);
  actions.appendChild(btnRemove);
  header.appendChild(actions);
  wrapper.appendChild(header);
  
  // Detalhes da exclusão
  const content = document.createElement('div');
  content.className = 'exclusion-justification';
  content.textContent = item.justificativa;
  wrapper.appendChild(content);
  
  const source = document.createElement('div');
  source.className = 'exclusion-source';
  source.textContent = `Fonte: Bula p. ${item.pagina}`;
  wrapper.appendChild(source);
  
  // Mensagem da Decisão
  if (decision === 'accepted') {
    const banner = document.createElement('div');
    banner.className = 'decision-banner accepted';
    banner.innerHTML = `<span>✓</span> Mantido no banco`;
    wrapper.appendChild(banner);
  } else if (decision === 'rejected') {
    const banner = document.createElement('div');
    banner.className = 'decision-banner rejected';
    banner.innerHTML = `<span>✕</span> Marcado para remoção`;
    wrapper.appendChild(banner);
  }
  
  return wrapper;
}


// ==========================================
// RENDERIZADORES DO MODELO 2 (TABELA + DRAWER)
// ==========================================
function renderModelo2(dados) {
  const tableHead = document.getElementById('table-head');
  const tableBody = document.getElementById('table-body');
  if (!tableHead || !tableBody) return;
  
  // 1. Renderiza Cabeçalho da Tabela baseado na Aba
  tableHead.innerHTML = '';
  const headRow = document.createElement('tr');
  
  if (state.activeTab === 'alteracoes') {
    headRow.innerHTML = `
      <th>Cultura</th>
      <th>Praga</th>
      <th>Campos Alterados</th>
      <th>Status das Decisões</th>
    `;
  } else if (state.activeTab === 'novas') {
    headRow.innerHTML = `
      <th>Cultura</th>
      <th>Praga</th>
      <th>Dosagem Sugerida</th>
      <th>Status</th>
    `;
  } else if (state.activeTab === 'exclusoes') {
    headRow.innerHTML = `
      <th>Cultura</th>
      <th>Praga</th>
      <th>Justificativa da IA</th>
      <th>Status</th>
    `;
  }
  tableHead.appendChild(headRow);
  
  // 2. Renderiza Linhas da Tabela
  tableBody.innerHTML = '';
  
  if (dados.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" style="padding: 40px; text-align: center; color: var(--text-muted); font-size: 13px; background: #fff;">
      Nenhum item localizado.
    </td></tr>`;
    atualizarDrawer(null);
    return;
  }
  
  dados.forEach(item => {
    const row = document.createElement('tr');
    row.dataset.id = item.id;
    if (state.openRowId === item.id) {
      row.className = 'active-row';
    }
    
    // Vincula clique para abrir gaveta lateral
    row.addEventListener('click', () => {
      state.openRowId = state.openRowId === item.id ? null : item.id;
      
      // Remarca classes ativas de linha
      document.querySelectorAll('#table-body tr').forEach(r => {
        r.classList.toggle('active-row', r.dataset.id === state.openRowId);
      });
      
      const openItem = state.openRowId ? dados.find(x => x.id === state.openRowId) : null;
      atualizarDrawer(openItem);
    });
    
    // Conteúdo da Linha baseado na Aba
    if (state.activeTab === 'alteracoes') {
      // Campos de Classificação Filtrada
      const totalFields = item.fields.filter(f => state.filters.classificacao === 'Todas' || f.tipo === state.filters.classificacao);
      const matchedFields = item.fields.map((f, idx) => ({ ...f, idx }));
      
      let accepted = 0;
      let rejected = 0;
      totalFields.forEach(f => {
        const dec = state.decisions[`${item.id}:${f.idx}`];
        if (dec === 'accepted') accepted++;
        if (dec === 'rejected') rejected++;
      });
      const pending = totalFields.length - accepted - rejected;
      
      row.innerHTML = `
        <td style="font-weight:600; color:var(--text-primary);">${item.cultura}</td>
        <td>
          <div class="praga-td-title">${item.praga}</div>
          <div class="praga-td-sub">${item.cientifico}</div>
        </td>
        <td>${totalFields.length} campos (${totalFields.filter(f => f.tipo === 'obrigatoria').length} obrigatórios)</td>
        <td>
          <span style="font-size: 12px; color: var(--text-secondary);">
            ${pending} pendente(s) · ${accepted} aceito(s) · ${rejected} rejeitado(s)
          </span>
        </td>
      `;
    } else if (state.activeTab === 'novas') {
      const decision = state.decisions[item.id];
      let badgeHtml = '<span class="badge badge-secondary">PENDENTE</span>';
      if (decision === 'accepted') badgeHtml = '<span class="badge badge-success">ACEITO</span>';
      if (decision === 'rejected') badgeHtml = '<span class="badge badge-danger">REJEITADO</span>';
      
      row.innerHTML = `
        <td style="font-weight:600; color:var(--text-primary);">${item.cultura}</td>
        <td>
          <div class="praga-td-title">${item.praga}</div>
          <div class="praga-td-sub">${item.cientifico}</div>
        </td>
        <td>${item.dose}</td>
        <td>${badgeHtml}</td>
      `;
    } else if (state.activeTab === 'exclusoes') {
      const decision = state.decisions[item.id];
      let badgeHtml = '<span class="badge badge-secondary">A REVISAR</span>';
      if (decision === 'accepted') badgeHtml = '<span class="badge badge-success">MANTIDO</span>';
      if (decision === 'rejected') badgeHtml = '<span class="badge badge-danger">REMOVIDO</span>';
      
      row.innerHTML = `
        <td style="font-weight:600; color:var(--text-primary);">${item.cultura}</td>
        <td>
          <div class="praga-td-title">${item.praga}</div>
          <div class="praga-td-sub">${item.cientifico}</div>
        </td>
        <td style="max-width: 320px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${item.justificativa}</td>
        <td>${badgeHtml}</td>
      `;
    }
    
    tableBody.appendChild(row);
  });
  
  // 3. Atualiza Drawer com base na linha aberta (se houver)
  const openItem = state.openRowId ? dados.find(x => x.id === state.openRowId) : null;
  atualizarDrawer(openItem);
}

// Atualiza o painel lateral com detalhes do item selecionado
function atualizarDrawer(item) {
  const drawer = document.getElementById('detail-drawer');
  if (!drawer) return;
  
  if (!item) {
    drawer.innerHTML = `
      <div class="drawer-empty-state">
        <svg viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
        <div>Clique em uma linha à esquerda para ver o comparativo completo entre o valor atual e o sugerido pela IA.</div>
      </div>
    `;
    return;
  }
  
  drawer.innerHTML = '';
  
  // Cabeçalho do Drawer
  const header = document.createElement('div');
  header.innerHTML = `
    <div class="drawer-title">${item.cultura} · ${item.praga}</div>
    <div class="drawer-subtitle">${item.cientifico}</div>
  `;
  drawer.appendChild(header);
  
  // Detalhamento conforme a Aba ativa
  if (state.activeTab === 'alteracoes') {
    const list = document.createElement('div');
    list.style.marginTop = '18px';
    
    item.fields.forEach((field, idx) => {
      // Aplica filtro de classificação também na gaveta lateral
      if (state.filters.classificacao !== 'Todas' && field.tipo !== state.filters.classificacao) {
        return;
      }
      
      const decisionKey = `${item.id}:${idx}`;
      const currentDecision = state.decisions[decisionKey];
      
      const fieldBlock = document.createElement('div');
      fieldBlock.className = 'drawer-field-diff';
      
      const isObrigatoria = field.tipo === 'obrigatoria';
      const badgeClass = isObrigatoria ? 'badge-warning' : 'badge-secondary';
      const labelBadge = isObrigatoria ? 'ALTERAÇÃO OBRIGATÓRIA' : 'REVISÃO NECESSÁRIA';
      
      fieldBlock.innerHTML = `
        <div class="drawer-field-label" style="display:flex; justify-content:space-between; align-items:center;">
          <span>${field.label}</span>
          <span class="badge ${badgeClass}" style="font-size: 8px;">${labelBadge}</span>
        </div>
        
        <div class="drawer-block">
          <div class="drawer-block-title">Atual</div>
          <div class="drawer-block-val">${field.atual || 'Não informado'}</div>
        </div>
      `;
      
      const suggestedBlock = document.createElement('div');
      if (field.tipo === 'revisao') {
        suggestedBlock.className = 'drawer-block ia-note';
        suggestedBlock.innerHTML = `
          <div class="drawer-block-title">Nota da IA</div>
          <div class="drawer-block-val">${field.nota}</div>
        `;
      } else {
        suggestedBlock.className = 'drawer-block suggested';
        suggestedBlock.innerHTML = `
          <div class="drawer-block-title">Sugerido</div>
          <div class="drawer-block-val">${field.sugerido || 'Remover valor'}</div>
        `;
      }
      fieldBlock.appendChild(suggestedBlock);
      
      // Botões Unitários na Gaveta
      const actionRow = document.createElement('div');
      actionRow.className = 'drawer-field-actions';
      
      const btnAccept = document.createElement('button');
      btnAccept.className = 'drawer-btn-accept';
      btnAccept.innerHTML = `✓ ${currentDecision === 'accepted' ? 'Aceito' : 'Aceitar'}`;
      if (currentDecision === 'accepted') btnAccept.style.fontWeight = '700';
      btnAccept.addEventListener('click', () => {
        state.decisions[decisionKey] = currentDecision === 'accepted' ? undefined : 'accepted';
        render();
      });
      
      const btnReject = document.createElement('button');
      btnReject.className = 'drawer-btn-reject';
      btnReject.innerHTML = `✕ ${currentDecision === 'rejected' ? 'Rejeitado' : 'Rejeitar'}`;
      if (currentDecision === 'rejected') btnReject.style.fontWeight = '700';
      btnReject.addEventListener('click', () => {
        state.decisions[decisionKey] = currentDecision === 'rejected' ? undefined : 'rejected';
        render();
      });
      
      actionRow.appendChild(btnAccept);
      actionRow.appendChild(btnReject);
      fieldBlock.appendChild(actionRow);
      
      list.appendChild(fieldBlock);
    });
    
    drawer.appendChild(list);
  } else if (state.activeTab === 'novas') {
    const decision = state.decisions[item.id];
    const details = document.createElement('div');
    details.style.marginTop = '18px';
    
    details.innerHTML = `
      <div class="badge badge-success" style="margin-bottom:12px;">NOVA ENTRADA</div>
      <div class="drawer-new-grid">
        <div class="drawer-new-item"><div class="drawer-new-label">DOSAGEM</div><div class="drawer-new-val">${item.dose}</div></div>
        <div class="drawer-new-item"><div class="drawer-new-label">MODALIDADE</div><div class="drawer-new-val">${item.modalidade}</div></div>
        <div class="drawer-new-item"><div class="drawer-new-label">EXCEÇÕES</div><div class="drawer-new-val">${item.excecoes}</div></div>
        <div class="drawer-new-item"><div class="drawer-new-label">CALDA TERRESTRE</div><div class="drawer-new-val">${item.caldaTerrestre}</div></div>
        <div class="drawer-new-item" style="grid-column: span 2;"><div class="drawer-new-label">CALDA AÉREA</div><div class="drawer-new-val">${item.caldaAerea}</div></div>
        <div class="drawer-new-item" style="grid-column: span 2;"><div class="drawer-new-label">FONTE</div><div class="drawer-new-val">Bula p. ${item.pagina}</div></div>
      </div>
    `;
    
    const actions = document.createElement('div');
    actions.className = 'drawer-field-actions';
    actions.style.marginTop = '18px';
    
    const btnAccept = document.createElement('button');
    btnAccept.className = 'drawer-btn-accept';
    btnAccept.style.padding = '10px';
    btnAccept.innerHTML = `✓ ${decision === 'accepted' ? 'Aceito' : 'Aceitar entrada'}`;
    btnAccept.addEventListener('click', () => {
      state.decisions[item.id] = decision === 'accepted' ? undefined : 'accepted';
      render();
    });
    
    const btnReject = document.createElement('button');
    btnReject.className = 'drawer-btn-reject';
    btnReject.style.padding = '10px';
    btnReject.innerHTML = `✕ ${decision === 'rejected' ? 'Rejeitado' : 'Rejeitar'}`;
    btnReject.addEventListener('click', () => {
      state.decisions[item.id] = decision === 'rejected' ? undefined : 'rejected';
      render();
    });
    
    actions.appendChild(btnAccept);
    actions.appendChild(btnReject);
    details.appendChild(actions);
    
    if (decision === 'accepted') {
      const banner = document.createElement('div');
      banner.className = 'decision-banner accepted';
      banner.innerHTML = `<span>✓</span> Entrada aceita — será criada no banco`;
      details.appendChild(banner);
    } else if (decision === 'rejected') {
      const banner = document.createElement('div');
      banner.className = 'decision-banner rejected';
      banner.innerHTML = `<span>✕</span> Rejeitado — não será criado`;
      details.appendChild(banner);
    }
    
    drawer.appendChild(details);
  } else if (state.activeTab === 'exclusoes') {
    const decision = state.decisions[item.id];
    const details = document.createElement('div');
    details.style.marginTop = '18px';
    
    details.innerHTML = `
      <div class="badge badge-danger" style="margin-bottom:12px;">POSSÍVEL EXCLUSÃO</div>
      <div class="drawer-exclusion-text">${item.justificativa}</div>
      <div class="drawer-exclusion-source">Fonte: Bula p. ${item.pagina}</div>
    `;
    
    const actions = document.createElement('div');
    actions.className = 'drawer-field-actions';
    actions.style.marginTop = '18px';
    
    const btnKeep = document.createElement('button');
    btnKeep.className = 'drawer-btn-accept';
    btnKeep.style.cssText = 'background: #fff; border: 1px solid var(--border-color); color: var(--text-light); padding: 10px;';
    btnKeep.innerHTML = `Manter no banco`;
    btnKeep.addEventListener('click', () => {
      state.decisions[item.id] = decision === 'accepted' ? undefined : 'accepted';
      render();
    });
    
    const btnRemove = document.createElement('button');
    btnRemove.className = 'drawer-btn-reject';
    btnRemove.style.padding = '10px';
    btnRemove.innerHTML = `✕ Remover`;
    btnRemove.addEventListener('click', () => {
      state.decisions[item.id] = decision === 'rejected' ? undefined : 'rejected';
      render();
    });
    
    actions.appendChild(btnKeep);
    actions.appendChild(btnRemove);
    details.appendChild(actions);
    
    if (decision === 'accepted') {
      const banner = document.createElement('div');
      banner.className = 'decision-banner accepted';
      banner.innerHTML = `<span>✓</span> Mantido no banco`;
      details.appendChild(banner);
    } else if (decision === 'rejected') {
      const banner = document.createElement('div');
      banner.className = 'decision-banner rejected';
      banner.innerHTML = `<span>✕</span> Marcado para remoção`;
      details.appendChild(banner);
    }
    
    drawer.appendChild(details);
  }
}
