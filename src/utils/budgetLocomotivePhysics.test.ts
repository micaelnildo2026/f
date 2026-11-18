import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBudgetSummary,
  calculateScrewdriverChainDrivetrain,
  BudgetLocomotiveItem,
} from './budgetLocomotivePhysics';

test('bicycle chain drivetrain ensures safe rail clearance and competition speed', () => {
  const out = calculateScrewdriverChainDrivetrain({
    screwdriverRpm: 290,
    screwdriverRatedTorqueNm: 4.6,
    screwdriverStallTorqueNm: 14.5,
    motorSprocketTeeth: 14,
    axleSprocketTeeth: 16,
    wheelDiameterMm: 84,
    locoMassKg: 7.65,
    frictionCoeff: 0.68,
  });

  assert.equal(out.chainPitchMm, 12.7);
  assert.equal(out.clearanceOk, true);
  assert.ok(out.railClearanceMm >= 6.0, `Expected >= 6mm rail clearance, got ${out.railClearanceMm}`);
  assert.ok(out.wheelLinearSpeedMs >= 0.9 && out.wheelLinearSpeedMs <= 1.3);
  assert.ok(out.motorTractiveForceN > out.adhesionLimitN);
});

test('budget audit keeps core traction/power under R$ 200 cap while separating RC system', () => {
  const sampleItems: BudgetLocomotiveItem[] = [
    {
      id: 'motor',
      name: 'Motor Parafusadeira 12V + Planetária',
      spec: 'RS-550 1:36',
      category: 'core_budget',
      unitCostBrl: 68,
      massG: 520,
      sourceTip: 'Parafusadeira 12V usada/outlet',
    },
    {
      id: 'battery',
      name: 'Bateria 12V Li-Ion da Parafusadeira',
      spec: '3S 1.5Ah',
      category: 'core_budget',
      unitCostBrl: 47,
      massG: 240,
      sourceTip: 'Mesmo kit 12V',
    },
    {
      id: 'axle',
      name: 'Eixos de Aço Ø10mm',
      spec: '2x 195mm',
      category: 'core_budget',
      unitCostBrl: 22,
      massG: 260,
      sourceTip: 'Casa de ferragens',
    },
    {
      id: 'sprockets',
      name: '3x Rodas Dentadas Bicicleta',
      spec: '14T + 2x 16T',
      category: 'core_budget',
      unitCostBrl: 33,
      massG: 340,
      sourceTip: 'Bicicletaria local',
    },
    {
      id: 'chain',
      name: 'Corrente Bicicleta 1/2 x 1/8',
      spec: '114 elos cortada',
      category: 'core_budget',
      unitCostBrl: 22,
      massG: 290,
      sourceTip: 'Bicicletaria local',
    },
    {
      id: 'wheels3d',
      name: '4 Rodas Ø84mm + Chassi 150mm',
      spec: 'Impressão 3D Gratuita',
      category: 'free_3d_print',
      unitCostBrl: 0,
      massG: 1650,
      sourceTip: 'Serviço 3D gratuito',
    },
    {
      id: 'rc',
      name: 'Sistema de Controle Remoto (ESP32 + Ponte H 43A)',
      spec: 'Wi-Fi/BT Gamepad',
      category: 'remote_control_excluded',
      unitCostBrl: 95,
      massG: 140,
      sourceTip: 'Fora do teto de R$ 200',
    },
  ];

  const audit = calculateBudgetSummary(sampleItems, 200);
  assert.equal(audit.coreTotalBrl, 192);
  assert.equal(audit.withinBudgetCap, true);
  assert.equal(audit.remainingMarginBrl, 8);
  assert.equal(audit.remoteControlTotalBrl, 95);
  assert.equal(audit.grandTotalWithRcBrl, 287);
});
