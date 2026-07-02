export const ALTERACOES = [
  { id: '115897', cultura: 'Algodão', praga: 'Amendoim-bravo', cientifico: 'Euphorbia heterophylla', excecao: 'Sistema de Plantio Direto', fields: [
    { label: 'Modalidade de Aplicação', atual: 'Pulverização costal | Pulverização tratorizada', sugerido: 'Pulverização tratorizada | Pulverização aérea', tipo: 'obrigatoria' },
    { label: 'Calda Terrestre', atual: '200 a 400 L de calda/ha', sugerido: '50 a 200 L de calda/ha', tipo: 'obrigatoria' },
    { label: 'Calda Aérea', atual: 'Não informado', sugerido: '15 a 40 L de calda/ha', tipo: 'obrigatoria' },
    { label: 'Taxa de Aplicação', atual: 'Não informado', sugerido: null, nota: 'A bula não define esse campo de forma inequívoca — revisão humana necessária antes do preenchimento.', tipo: 'revisao' },
  ] },
  { id: '115898b', cultura: 'Algodão', praga: 'Angiquinho', cientifico: 'Aeschynomene rudis', excecao: 'Sistema de Plantio Direto', fields: [
    { label: 'Dosagem Máxima', atual: '3 L/ha', sugerido: '2 L/ha', tipo: 'obrigatoria' },
    { label: 'Modalidade de Aplicação', atual: 'Pulverização costal | Pulverização tratorizada', sugerido: 'Pulverização tratorizada | Pulverização aérea', tipo: 'obrigatoria' },
    { label: 'Intervalo de Segurança', atual: 'SPD: não determinado · Geneticamente modificado: 130 dias', sugerido: 'Não determinado', tipo: 'obrigatoria' },
  ] },
  { id: '116118', cultura: 'Soja', praga: 'Amendoim-bravo', cientifico: 'Euphorbia heterophylla', excecao: 'Sistema de Plantio Direto', fields: [
    { label: 'Modalidade de Aplicação', atual: 'Pulverização costal | Pulverização tratorizada', sugerido: 'Pulverização tratorizada | Pulverização aérea', tipo: 'obrigatoria' },
    { label: 'Calda Terrestre', atual: '200 a 400 L de calda/ha', sugerido: '50 a 200 L de calda/ha', tipo: 'obrigatoria' },
    { label: 'Intervalo de Segurança', atual: 'SPD: não determinado · Geneticamente modificado: 56 dias', sugerido: 'Não determinado', tipo: 'obrigatoria' },
  ] },
  { id: '192609', cultura: 'Milho', praga: 'Carrapicho-de-carneiro', cientifico: 'Acanthospermum hispidum', excecao: '—', fields: [
    { label: 'Modalidade de Aplicação', atual: 'Pulverização aérea | Pulverização tratorizada', sugerido: 'Pulverização tratorizada | Pulverização aérea', tipo: 'obrigatoria' },
    { label: 'Exceções', atual: 'Não informado', sugerido: 'Sistema de Plantio Direto', tipo: 'obrigatoria' },
    { label: 'Temperatura do Ar', atual: 'Inferior a 30 °C', sugerido: 'Inferior a 25 °C', tipo: 'obrigatoria' },
    { label: 'Umidade do Ar', atual: 'Superior a 50%', sugerido: 'Superior a 70%', tipo: 'obrigatoria' },
  ] },
  { id: '115963', cultura: 'Cana-de-açúcar', praga: 'Amendoim-bravo', cientifico: 'Euphorbia heterophylla', excecao: '—', fields: [
    { label: 'Calda Terrestre', atual: '200 a 400 L de calda/ha', sugerido: 'Bentley: 80 a 120 L/ha · Tratorizada: 200 a 400 L/ha · Costal: 100 a 200 L/ha', tipo: 'obrigatoria' },
    { label: 'Intervalo de Segurança', atual: '30 dias', sugerido: 'Não determinado (pré-plantio)', tipo: 'obrigatoria' },
  ] },
];

export const NOVAS = [
  { id: 'n1', cultura: 'Algodão', praga: 'Carrapicho-rasteiro', cientifico: 'Acanthospermum australe', dose: '1,5 L/ha', modalidade: 'Pulverização tratorizada | Pulverização aérea', excecoes: 'Sistema de Plantio Direto', caldaTerrestre: '50 a 200 L de calda/ha', caldaAerea: '15 a 40 L de calda/ha', pagina: '4' },
  { id: 'n2', cultura: 'Algodão', praga: 'Carrapicho-de-carneiro', cientifico: 'Acanthospermum hispidum', dose: '1,5 L/ha', modalidade: 'Pulverização tratorizada | Pulverização aérea', excecoes: 'Sistema de Plantio Direto', caldaTerrestre: '50 a 200 L de calda/ha', caldaAerea: '15 a 40 L de calda/ha', pagina: '4' },
  { id: 'n3', cultura: 'Algodão', praga: 'Mentrasto', cientifico: 'Ageratum conyzoides', dose: '2 L/ha', modalidade: 'Pulverização tratorizada | Pulverização aérea', excecoes: 'Sistema de Plantio Direto', caldaTerrestre: '50 a 200 L de calda/ha', caldaAerea: '15 a 40 L de calda/ha', pagina: '4' },
  { id: 'n4', cultura: 'Soja', praga: 'Carrapicho-rasteiro', cientifico: 'Acanthospermum australe', dose: '1,5 L/ha', modalidade: 'Pulverização tratorizada | Pulverização aérea', excecoes: 'Sistema de Plantio Direto', caldaTerrestre: '50 a 200 L de calda/ha', caldaAerea: '15 a 40 L de calda/ha', pagina: '4' },
  { id: 'n5', cultura: 'Milho', praga: 'Apaga-fogo', cientifico: 'Alternanthera tenella', dose: '1 L/ha', modalidade: 'Pulverização tratorizada | Pulverização aérea', excecoes: 'Sistema de Plantio Direto', caldaTerrestre: '50 a 200 L de calda/ha', caldaAerea: '15 a 40 L de calda/ha', pagina: '4' },
  { id: 'n6', cultura: 'Cana-de-açúcar', praga: 'Carrapicho-rasteiro', cientifico: 'Acanthospermum australe', dose: '1,5 L/ha', modalidade: 'Pulverização costal | Pulverização tratorizada', excecoes: '—', caldaTerrestre: 'Bentley: 80 a 120 L/ha · Tratorizada: 200 a 400 L/ha · Costal: 100 a 200 L/ha', caldaAerea: 'Não aplicável', pagina: '4' },
];

export const EXCLUSOES = [
  { id: 'e1', cultura: 'Algodão', praga: 'Arroz vermelho', cientifico: 'Oryza sativa', justificativa: 'Relação não localizada na tabela atual de plantas infestantes da cultura geral.', pagina: '4-7' },
  { id: 'e2', cultura: 'Algodão', praga: 'Capim-marmelada', cientifico: 'Brachiaria plantaginea', justificativa: 'Relação não localizada na tabela atual de plantas infestantes da cultura geral.', pagina: '4-7' },
  { id: 'e3', cultura: 'Algodão', praga: 'Corda-de-viola', cientifico: 'Ipomoea grandifolia', justificativa: 'Relação não localizada na tabela atual de plantas infestantes da cultura geral.', pagina: '4-7' },
  { id: 'e4', cultura: 'Soja', praga: 'Arroz vermelho', cientifico: 'Oryza sativa', justificativa: 'Relação não localizada na tabela atual de plantas infestantes da cultura geral.', pagina: '4-7' },
  { id: 'e5', cultura: 'Milho', praga: 'Falso-cominho', cientifico: 'Fimbristylis miliacea', justificativa: 'Relação não localizada na tabela atual de plantas infestantes da cultura geral.', pagina: '4-7' },
  { id: 'e6', cultura: 'Cana-de-açúcar', praga: 'Arroz vermelho', cientifico: 'Oryza sativa', justificativa: 'Relação não localizada na tabela atual de plantas infestantes da cultura geral.', pagina: '4-7' },
];
