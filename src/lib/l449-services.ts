import type { Activity } from "./types";

/** Itens de serviço da planilha L449 São Joaquim (Lytorânea). */
export const L449_SERVICES: Activity[] = [
  { id: "b-1-1", code: "B.1.1", name: "Serviços topográficos", kind: "servico" },
  { id: "b-1-2", code: "B.1.2", name: "Projeto executivo de drenagem", kind: "servico" },
  { id: "b-1-3", code: "B.1.3", name: "Projeto executivo de via", kind: "servico" },
  { id: "b-1-4", code: "B.1.4", name: "Amostra de solo — preparação para compactação", kind: "servico" },
  { id: "b-1-5", code: "B.1.5", name: "Análise granulométrica (peneiramento)", kind: "servico" },
  { id: "b-1-6", code: "B.1.6", name: "Limite de liquidez", kind: "servico" },
  { id: "b-1-7", code: "B.1.7", name: "Limite de plasticidade", kind: "servico" },
  { id: "b-1-8", code: "B.1.8", name: "Compactação: energia Proctor normal", kind: "servico" },
  { id: "b-1-9", code: "B.1.9", name: "Compactação: energia AASHO intermediária", kind: "servico" },
  { id: "b-1-10", code: "B.1.10", name: "ISC / CBR — 5 pontos (energia normal)", kind: "servico" },
  { id: "b-1-11", code: "B.1.11", name: "ISC / CBR — 5 pontos (energia intermediária)", kind: "servico" },
  { id: "b-1-12", code: "B.1.12", name: "Umidade natural em estufa", kind: "servico" },
  { id: "b-1-13", code: "B.1.13", name: "Perfuração manual de solo a trado até 6\"", kind: "servico" },

  { id: "b-2-1", code: "B.2.1", name: "Tapume de vedação ou proteção", kind: "servico" },
  { id: "b-2-10", code: "B.2.10", name: "Cerca protetora de borda de vala", kind: "servico" },
  { id: "b-2-11", code: "B.2.11", name: "Barragem de bloqueio de obra na via", kind: "servico" },
  { id: "b-2-12", code: "B.2.12", name: "Placa de sinalização preventiva na via", kind: "servico" },

  { id: "b-3-1", code: "B.3.1", name: "Escavação mecânica de vala (1ª categoria)", kind: "servico" },
  { id: "b-3-2", code: "B.3.2", name: "Escavação mecânica de vala (1ª categoria) II", kind: "servico" },
  { id: "b-3-3", code: "B.3.3", name: "Escavação mecânica de vala (1ª categoria) III", kind: "servico" },
  { id: "b-3-4", code: "B.3.4", name: "Escavação mecânica de vala (1ª categoria) IV", kind: "servico" },
  { id: "b-3-5", code: "B.3.5", name: "Reaterro de vala/cava com material de boa qualidade", kind: "servico" },
  { id: "b-3-6", code: "B.3.6", name: "Escavação mecânica com trator de lâmina", kind: "servico" },
  { id: "b-3-7", code: "B.3.7", name: "Dragagem em leito de rio ou canal", kind: "servico" },
  { id: "b-3-8", code: "B.3.8", name: "Escavação a céu aberto (1ª categoria)", kind: "servico" },

  { id: "b-4-1", code: "B.4.1", name: "Transporte de carga (t × km)", kind: "servico" },
  { id: "b-4-2", code: "B.4.2", name: "Transporte de container", kind: "servico" },
  { id: "b-4-3", code: "B.4.3", name: "Carga de material com pá-carregadeira", kind: "servico" },
  { id: "b-4-4", code: "B.4.4", name: "Carga e descarga de container", kind: "servico" },
  { id: "b-4-5", code: "B.4.5", name: "Disposição final de materiais e resíduos", kind: "servico" },
  { id: "b-4-6", code: "B.4.6", name: "Transporte de equipamentos pesados em carreta", kind: "servico" },
  { id: "b-4-7", code: "B.4.7", name: "Carga e descarga de equipamentos pesados", kind: "servico" },

  { id: "b-5-1", code: "B.5.1", name: "Placa de sinalização de rodovias", kind: "servico" },
  { id: "b-5-2", code: "B.5.2", name: "Sinalização horizontal termoplástica", kind: "servico" },
  { id: "b-5-3", code: "B.5.3", name: "Sinalização de faixas para pedestres", kind: "servico" },
  { id: "b-5-4", code: "B.5.4", name: "Placa de sinalização de alumínio", kind: "servico" },
  { id: "b-5-5", code: "B.5.5", name: "Instalação e retirada de placas em postes", kind: "servico" },
  { id: "b-5-6", code: "B.5.6", name: "Assentamento de poste de aço 3,50 a 6,00 m", kind: "servico" },
  { id: "b-5-7", code: "B.5.7", name: "Demolição manual de concreto simples", kind: "servico" },

  { id: "b-6-1", code: "B.6.1", name: "Tubo de concreto armado PA-1", kind: "servico" },
  { id: "b-6-2", code: "B.6.2", name: "Tubo de concreto armado PA-1 II", kind: "servico" },
  { id: "b-6-3", code: "B.6.3", name: "Tubo de concreto armado PA-1 III", kind: "servico" },
  { id: "b-6-4", code: "B.6.4", name: "Tubo de concreto armado PA-1 IV", kind: "servico" },
  { id: "b-6-5", code: "B.6.5", name: "Tubo de concreto armado PA-1 V", kind: "servico" },
  { id: "b-6-6", code: "B.6.6", name: "Tubo de concreto armado PA-1 VI", kind: "servico" },
  { id: "b-6-7", code: "B.6.7", name: "Tubo de concreto armado PA-1 VII", kind: "servico" },
  { id: "b-6-8", code: "B.6.8", name: "Poço de visita em alvenaria de blocos", kind: "servico" },
  { id: "b-6-9", code: "B.6.9", name: "Poço de visita em alvenaria de blocos II", kind: "servico" },
  { id: "b-6-10", code: "B.6.10", name: "Poço de visita em alvenaria de blocos III", kind: "servico" },
  { id: "b-6-11", code: "B.6.11", name: "Poço de visita em alvenaria de blocos IV", kind: "servico" },
  { id: "b-6-12", code: "B.6.12", name: "Poço de visita em alvenaria de blocos V", kind: "servico" },
  { id: "b-6-13", code: "B.6.13", name: "Poço de visita de blocos de concreto", kind: "servico" },
  { id: "b-6-14", code: "B.6.14", name: "Tampão de ferro fundido dúctil articulado", kind: "servico" },
  { id: "b-6-15", code: "B.6.15", name: "Corpo de PV de anéis pré-moldados", kind: "servico" },
  { id: "b-6-16", code: "B.6.16", name: "Caixa de ralo em concreto pré-moldado", kind: "servico" },
  { id: "b-6-17", code: "B.6.17", name: "Embasamento de tubulação com pó-de-pedra", kind: "servico" },
  { id: "b-6-18", code: "B.6.18", name: "Escoramento de vala tipo blindagem", kind: "servico" },
  { id: "b-6-19", code: "B.6.19", name: "Esgotamento de valas", kind: "servico" },
  { id: "b-6-20", code: "B.6.20", name: "Tubo de concreto armado PA-2", kind: "servico" },
  { id: "b-6-21", code: "B.6.21", name: "Tubo de concreto armado PA-2 II", kind: "servico" },
  { id: "b-6-22", code: "B.6.22", name: "Tubo de concreto armado PA-2 III", kind: "servico" },
  { id: "b-6-23", code: "B.6.23", name: "Tubo de concreto armado PA-2 IV", kind: "servico" },
  { id: "b-6-24", code: "B.6.24", name: "Tubo de concreto armado PA-2 V", kind: "servico" },
  { id: "b-6-25", code: "B.6.25", name: "Concreto armado fck 30 MPa", kind: "servico" },
  { id: "b-6-26", code: "B.6.26", name: "Muro de contenção em alvenaria de bloco", kind: "servico" },
  { id: "b-6-27", code: "B.6.27", name: "Pó-de-pedra, inclusive transporte", kind: "servico" },

  { id: "b-7-1", code: "B.7.1", name: "Base de brita corrida", kind: "servico" },
  { id: "b-7-2", code: "B.7.2", name: "Sub-base de brita corrida", kind: "servico" },
  { id: "b-7-3", code: "B.7.3", name: "Revestimento CBUQ", kind: "servico" },
  { id: "b-7-4", code: "B.7.4", name: "Imprimação de base de pavimentação", kind: "servico" },
  { id: "b-7-5", code: "B.7.5", name: "Regularização de subleito", kind: "servico" },
  { id: "b-7-6", code: "B.7.6", name: "Sarjeta e meio-fio conjugado de concreto", kind: "servico" },
  { id: "b-7-7", code: "B.7.7", name: "Preparo manual de terreno", kind: "servico" },
  { id: "b-7-8", code: "B.7.8", name: "Pátio de concreto 10 cm", kind: "servico" },
  { id: "b-7-9", code: "B.7.9", name: "Contrapiso / camada regularizadora", kind: "servico" },
  { id: "b-7-10", code: "B.7.10", name: "Revestimento tátil alerta", kind: "servico" },
  { id: "b-7-11", code: "B.7.11", name: "Saibro, inclusive transporte", kind: "servico" },
  { id: "b-7-12", code: "B.7.12", name: "Aterro com material de 1ª categoria", kind: "servico" },

  { id: "b-99-2-1", code: "B.99.2.1", name: "Reparos de rede de esgoto", kind: "servico" },
  { id: "b-99-2-2", code: "B.99.2.2", name: "Reparos de rede hidráulica", kind: "servico" },
  { id: "b-99-2-3", code: "B.99.2.3", name: "Reparos de rede elétrica", kind: "servico" },
  { id: "b-99-99-10", code: "B.99.99.10", name: "Serviços topográficos excedentes", kind: "servico" },
];

export const L449_SERVICE_IDS = L449_SERVICES.map((a) => a.id);

const EARTH = ["b-3-1", "b-3-2", "b-3-3", "b-3-4", "b-3-5", "b-3-6", "b-3-7", "b-3-8", "b-7-5", "b-7-7", "b-7-12"];
const DRAIN = [
  "b-6-1", "b-6-2", "b-6-3", "b-6-4", "b-6-5", "b-6-6", "b-6-7",
  "b-6-8", "b-6-9", "b-6-10", "b-6-11", "b-6-12", "b-6-13",
  "b-6-14", "b-6-15", "b-6-16", "b-6-17", "b-6-18", "b-6-19",
  "b-6-20", "b-6-21", "b-6-22", "b-6-23", "b-6-24", "b-6-25", "b-6-26", "b-6-27",
];
const PAVING = ["b-7-1", "b-7-2", "b-7-3", "b-7-4", "b-7-6", "b-7-8", "b-7-9", "b-7-10", "b-7-11"];
const HAUL = ["b-4-1", "b-4-2", "b-4-3", "b-4-4", "b-4-5", "b-4-6", "b-4-7"];
const SITE = ["b-1-1", "b-1-13", "b-2-10", "b-2-11", "b-2-12", "b-5-7", "b-99-2-1", "b-99-2-2", "b-99-2-3", "b-99-99-10"];

export const RETRO_L449 = [...SITE, ...EARTH, ...DRAIN, "b-5-7", "b-7-5", "b-7-7"];
export const ROLO_L449 = [...PAVING, "b-7-5", "b-7-12", "b-3-5"];
export const HAUL_L449 = [...HAUL, "b-3-5", "b-6-27", "b-7-1", "b-7-2", "b-7-11", "b-7-12", "b-4-5"];
export const PIPA_L449 = ["b-6-19", "b-7-4"];
export const VAN_L449 = ["b-4-2", "b-4-4", "b-1-1"];
