import { MotorOption, TransmissionConfig, LocomotiveSpecs } from '../types/locomotive';

export const MOTOR_OPTIONS: MotorOption[] = [
  {
    id: 'motor-775-planetary',
    name: 'Motor DC 775 com Redutor Planetário Metálico (1:19.2 / 12V-24V)',
    type: 'dc_planetary',
    voltage: 14.8, // Bateria LiPo 4S ou 12V LiFePO4
    noLoadRpm: 450,
    ratedRpm: 340,
    ratedTorque: 4.8, // N.m no eixo do redutor
    stallTorque: 18.5, // N.m no eixo do redutor
    ratedCurrent: 6.5,
    stallCurrent: 35.0,
    weight: 780,
    efficiency: 82,
    recommended: true,
    scoreHelpers: 9.8,
    scoreElevation: 9.6,
    scoreAcceleration: 8.9,
    scoreTugOfWar: 9.9,
    pros: [
      'Torque brutal de partida (indispensável para Cabo de Guerra e Helpers 20kg)',
      'Engrenagens planetárias internas 100% em aço sinterizado temperado',
      'Curva de torque linear com excelente resposta em baixa rotação',
      'Fácil controle por driver PWM de alta potência (Ponte H BTS7960 43A)',
      'Robustez comprovada em robótica pesada contra travamento sob carga extrema'
    ],
    cons: [
      'Peso próprio um pouco mais elevado (780g), porém benéfico como massa tratora',
      'Requer driver de potência com capacidade para picos de corrente > 30A'
    ],
    verdict: 'ESCOLHA CAMPEÃ: O motor DC 775 com planetária oferece a melhor relação torque/confiabilidade sem risco de desarmes de ESC ou perda de passos.'
  },
  {
    id: 'motor-brushless-3548',
    name: 'Motor Brushless Outrunner 3548 790KV + Redutor Modular 1:30',
    type: 'brushless_gear',
    voltage: 14.8,
    noLoadRpm: 390,
    ratedRpm: 320,
    ratedTorque: 4.2,
    stallTorque: 12.0,
    ratedCurrent: 8.0,
    stallCurrent: 45.0,
    weight: 420,
    efficiency: 88,
    recommended: false,
    scoreHelpers: 8.5,
    scoreElevation: 8.0,
    scoreAcceleration: 9.8,
    scoreTugOfWar: 7.6,
    pros: [
      'Altíssima eficiência elétrica (88%) e excelente relação potência/peso',
      'Arrancada violentamente rápida para a prova de aceleração 2500mm'
    ],
    cons: [
      'Cogging (trepidação) severo na partida se o ESC não for sensorizado (sensored)',
      'No cabo de guerra parado sob torque máximo, o ESC pode cortar por sobrecorrente térmica',
      'Complexidade maior de montagem e necessidade de redutor impresso customizado'
    ],
    verdict: 'Ótimo para velocidade pura, porém arriscado no Cabo de Guerra e na arrancada com 20kg no Helpers.'
  },
  {
    id: 'motor-550-worm',
    name: 'Motor DC 550 com Redutor de Rosca Sem-Fim (Worm Gear 1:40)',
    type: 'dc_worm',
    voltage: 12.0,
    noLoadRpm: 220,
    ratedRpm: 180,
    ratedTorque: 3.5,
    stallTorque: 10.0,
    ratedCurrent: 4.2,
    stallCurrent: 18.0,
    weight: 490,
    efficiency: 58,
    recommended: false,
    scoreHelpers: 8.0,
    scoreElevation: 9.0,
    scoreAcceleration: 5.5,
    scoreTugOfWar: 7.2,
    pros: [
      'Auto-travamento intrínseco (segura a locomotiva na rampa sem descer)',
      'Saída em 90 graus compacta'
    ],
    cons: [
      'Baixo rendimento mecânico (perde >40% da energia em atrito térmico)',
      'Velocidade muito lenta, prejudicando severamente a Prova de Aceleração 2500mm',
      'Fragilidade dos dentes da coroa de latão sob trancos bruscos de cabo de guerra'
    ],
    verdict: 'Excelente para segurar rampa, mas perde preciosos pontos na prova de velocidade.'
  },
  {
    id: 'motor-stepper-nema23',
    name: 'Motor de Passo NEMA 23 (2.2 N.m) + Driver Microstep',
    type: 'stepper',
    voltage: 24.0,
    noLoadRpm: 300,
    ratedRpm: 200,
    ratedTorque: 2.2,
    stallTorque: 2.2,
    ratedCurrent: 3.0,
    stallCurrent: 3.0,
    weight: 1050,
    efficiency: 65,
    recommended: false,
    scoreHelpers: 6.0,
    scoreElevation: 6.5,
    scoreAcceleration: 6.0,
    scoreTugOfWar: 4.5,
    pros: [
      'Precisão milimétrica de posicionamento e controle digital sem sensores extras'
    ],
    cons: [
      'Risco fatal de perda de passos (stall) no Cabo de Guerra e Helpers com 20kg',
      'Quando perde o passo, o torque cai para zero e o motor vibra parado sem tracionar',
      'Muito pesado (1.05 kg só o motor) e consumo estático contínuo elevado'
    ],
    verdict: 'Inadequado para tração pesada competitiva devido à perda catastrófica de passo sob sobrecarga.'
  }
];

export const DEFAULT_TRANSMISSION: TransmissionConfig = {
  motorRpm: 340, // RPM nominal da saída do redutor planetário 775
  motorPinionTeeth: 15, // Pinhão de aço/POM M1.0
  drivenGearTeeth: 45, // Engrenagem cilíndrica reta M1.0 no Eixo 1 (Redução 3:1)
  internalGearboxRatio: 19.2, // Redução interna planetária do motor
  pulleyWheelAxle1Teeth: 30, // Polia GT2 30T fixada no Eixo 1
  pulleyWheelAxle2Teeth: 30, // Polia GT2 30T fixada no Eixo 2 (Relação 1:1)
  wheelbaseMm: 160, // Distância entre eixos (wheelbase)
  wheelDiameterMm: 65, // Diâmetro de rolamento da roda
  beltPitchMm: 2, // Passo GT2 padrão = 2.0 mm
  beltWidthMm: 9 // Largura da correia GT2 reforçada = 9 mm
};

export const DEFAULT_LOCOMOTIVE_SPECS: LocomotiveSpecs = {
  gaugeMm: 150.0, // Exatamente 150 mm (Regulamento UFSC 3.a)
  hitchHeightMm: 107.5, // 105 a 110 mm (Regulamento UFSC 3.b) - Centro exato
  totalLengthMm: 335.0, // Máximo 360 mm (Margem segura de 25mm)
  totalWidthMm: 205.0, // Máximo 220 mm (Margem segura de 15mm)
  totalHeightMm: 245.0, // Máximo 330 mm (Margem segura de 85mm)
  totalWeightGrams: 7650, // Limite máximo 8000 g (Massa otimizada para atrito com margem de segurança de 350g)
  chassisWeightG: 1450, // Chassi e suportes de mancais em PETG/PA12-CF
  shellWeightG: 950, // Carenagem aerodinâmica impressa em PLA+/PETG
  motorGearboxWeightG: 880, // Motor 775 + Planetária + engrenagens
  batteryWeightG: 520, // LiPo 4S 5200mAh 50C com conector XT60
  wheelsetBearingsWeightG: 950, // 4 rodas de aço/alumínio + 2 eixos 8mm + 4 rolamentos 608ZZ
  ballastWeightG: 2900, // Compartimento de lastro em chumbo/esferas de aço centralizado no fundo
  wheelFrictionCoeff: 0.65 // Com inserto de anel o-ring de poliuretano na banda de rodagem sobre trilho
};

export const REGULATION_RULES = [
  {
    id: 'gauge',
    rule: '3.a',
    title: 'Medição da Bitola',
    requirement: 'Distância entre a parte central das rodas: exatamente 150 mm',
    ourValue: '150,0 mm',
    status: 'COMPLIANT',
    penalty: 'Reprovação imediata na inspeção técnica'
  },
  {
    id: 'hitch',
    rule: '3.b',
    title: 'Altura do Engate',
    requirement: 'Medido do nível inferior das rodas: deve compreender de 105 a 110 mm',
    ourValue: '107,5 mm (Centro da tolerância)',
    status: 'COMPLIANT',
    penalty: 'Reprovação na inspeção técnica (-3 pts se retestar)'
  },
  {
    id: 'weight',
    rule: '3.c',
    title: 'Peso Máximo do Protótipo',
    requirement: 'Não deve exceder 8000 gramas (8,0 kg)',
    ourValue: '7.650 g (Lastrado estrategicamente p/ atrito)',
    status: 'COMPLIANT',
    penalty: '+100g além de 8000g → penalidade de -0.2 pontos na nota'
  },
  {
    id: 'width',
    rule: '3.d',
    title: 'Largura Máxima',
    requirement: 'A largura do protótipo não pode ultrapassar 220 mm',
    ourValue: '205,0 mm (Margem de segurança de 15 mm)',
    status: 'COMPLIANT',
    penalty: '+10mm além de 220mm → -0.5 pontos'
  },
  {
    id: 'length',
    rule: '3.e',
    title: 'Comprimento Máximo',
    requirement: 'O comprimento do protótipo não deve superar 360 mm',
    ourValue: '335,0 mm (Margem de segurança de 25 mm)',
    status: 'COMPLIANT',
    penalty: '+10mm além de 360mm → -0.5 pontos'
  },
  {
    id: 'height',
    rule: '3.f',
    title: 'Altura Máxima',
    requirement: 'A altura não deve superar 330 mm',
    ourValue: '245,0 mm (Margem de segurança de 85 mm)',
    status: 'COMPLIANT',
    penalty: '+10mm além de 330mm → -0.5 pontos'
  },
  {
    id: 'loose_parts',
    rule: '3.g',
    title: 'Verificação de Partes Soltas',
    requirement: 'Não haver peças soltas no protótipo (inspeção rigorosa)',
    ourValue: 'Fixação 100% por parafusos M3/M4 sextavados e insertos roscados de latão termofixados',
    status: 'COMPLIANT',
    penalty: 'Reprovação imediata da equipe'
  },
  {
    id: 'power_plug',
    rule: '3.h',
    title: 'Alimentação Autônoma (Sem Tomadas)',
    requirement: 'Proibido funcionamento plugado em tomadas elétricas',
    ourValue: 'Bateria LiPo 4S 14.8V 5200mAh embarcada com chave geral industrial',
    status: 'COMPLIANT',
    penalty: 'Desqualificação'
  }
];

export const USER_CAD_SCREENSHOTS = [
  {
    id: 'cad-top',
    title: 'Vista Superior da Carenagem (Onshape)',
    path: '/assets/aistudio/Screenshot_20261106-160019_19bcb911.png',
    desc: 'Perfil aerodinâmico frontal com teto plano para escoamento e acesso interno à bateria.'
  },
  {
    id: 'cad-bottom',
    title: 'Vista Inferior do Chassi & 1º Eixo Montado',
    path: '/assets/aistudio/Screenshot_20261106-160106_449d222b.png',
    desc: 'Vão inferior com o primeiro rodeiro instalado e cavidade aberta para instalação do 2º eixo, correia GT2 e polias.'
  },
  {
    id: 'cad-inside-rear',
    title: 'Vista Traseira Interna da Cabine',
    path: '/assets/aistudio/Screenshot_20261106-160132_8bc985fe.png',
    desc: 'Visão dos apoios centrais do chassi, berço do motor 775 e altura do engate traseiro.'
  },
  {
    id: 'cad-iso-high',
    title: 'Perspectiva Isométrica Superior',
    path: '/assets/aistudio/Screenshot_20261106-160005_d592405b.png',
    desc: 'Geometria fluida moderna com montantes de janelas reforçados para rigidez torcional.'
  },
  {
    id: 'cad-side',
    title: 'Vista Lateral (Elevação)',
    path: '/assets/aistudio/Screenshot_20261106-155942_2b87f2c4.png',
    desc: 'Janela panorâmica frontal inclinada, porta de cabine e proporções para cumprimento de 335 mm e altura de 245 mm.'
  },
  {
    id: 'cad-front',
    title: 'Vista Frontal com Rodeiro 150mm',
    path: '/assets/aistudio/Screenshot_20261106-155924_1b876034.png',
    desc: 'Bitola de 150 mm entre os centros das rodas com flange ferroviário nos trilhos.'
  }
];
