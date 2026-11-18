export type BudgetComponentCategory = 'core_budget' | 'free_3d_print' | 'remote_control_excluded';

export interface BudgetLocomotiveItem {
  id: string;
  name: string;
  spec: string;
  category: BudgetComponentCategory;
  unitCostBrl: number;
  massG: number;
  sourceTip: string;
}

export interface ChainDrivetrainInput {
  screwdriverRpm: number; // Loaded RPM in 1st gear (torque mode)
  screwdriverRatedTorqueNm: number;
  screwdriverStallTorqueNm: number;
  motorSprocketTeeth: number; // e.g. 14T bicycle sprocket
  axleSprocketTeeth: number; // e.g. 16T bicycle sprocket on both axles (4x4)
  wheelDiameterMm: number; // e.g. 84 mm 3D printed wheel + inner-tube tire
  locoMassKg: number; // e.g. 7.65 kg
  frictionCoeff: number; // e.g. 0.68 with bicycle inner-tube rubber tread
}

export interface ChainDrivetrainOutput {
  chainPitchMm: number;
  motorSprocketPitchDiaMm: number;
  axleSprocketPitchDiaMm: number;
  axleSprocketOuterDiaMm: number;
  railClearanceMm: number;
  chainReductionRatio: number;
  wheelRpm: number;
  wheelLinearSpeedMs: number;
  axleRatedTorqueNm: number;
  axleStallTorqueNm: number;
  motorTractiveForceN: number;
  adhesionLimitN: number;
  clearanceOk: boolean;
}

export interface BudgetAuditSummary {
  budgetCapBrl: number;
  coreTotalBrl: number;
  remainingMarginBrl: number;
  withinBudgetCap: boolean;
  remoteControlTotalBrl: number;
  grandTotalWithRcBrl: number;
  free3dMassG: number;
  purchasedMassG: number;
  totalEstimatedMassG: number;
}

const BIKE_CHAIN_PITCH_MM = 12.7; // ANSI #40 / ISO 1/2" x 1/8" bicycle chain

export function sprocketPitchDiameterMm(teeth: number, pitchMm = BIKE_CHAIN_PITCH_MM): number {
  const safeTeeth = Math.max(8, teeth);
  return pitchMm / Math.sin(Math.PI / safeTeeth);
}

/**
 * Computes exact bicycle chain + screwdriver drivetrain kinematics & rail clearance.
 */
export function calculateScrewdriverChainDrivetrain(
  input: ChainDrivetrainInput
): ChainDrivetrainOutput {
  const motorSprocketPitchDiaMm = sprocketPitchDiameterMm(input.motorSprocketTeeth);
  const axleSprocketPitchDiaMm = sprocketPitchDiameterMm(input.axleSprocketTeeth);
  // Standard bicycle sprocket outer diameter is ~pitchDia + 5.2 mm
  const axleSprocketOuterDiaMm = axleSprocketPitchDiaMm + 5.2;
  const railClearanceMm = (input.wheelDiameterMm - axleSprocketOuterDiaMm) / 2;

  const chainReductionRatio = input.axleSprocketTeeth / input.motorSprocketTeeth;
  const chainEfficiency = 0.90;
  const wheelRpm = input.screwdriverRpm / chainReductionRatio;
  const wheelRadiusM = input.wheelDiameterMm / 2000;
  const wheelLinearSpeedMs = (wheelRpm / 60) * (2 * Math.PI * wheelRadiusM);

  const axleRatedTorqueNm = input.screwdriverRatedTorqueNm * chainReductionRatio * chainEfficiency;
  const axleStallTorqueNm = input.screwdriverStallTorqueNm * chainReductionRatio * chainEfficiency;
  const motorTractiveForceN = axleRatedTorqueNm / wheelRadiusM;
  const adhesionLimitN = input.frictionCoeff * input.locoMassKg * 9.81;

  return {
    chainPitchMm: BIKE_CHAIN_PITCH_MM,
    motorSprocketPitchDiaMm: Number(motorSprocketPitchDiaMm.toFixed(1)),
    axleSprocketPitchDiaMm: Number(axleSprocketPitchDiaMm.toFixed(1)),
    axleSprocketOuterDiaMm: Number(axleSprocketOuterDiaMm.toFixed(1)),
    railClearanceMm: Number(railClearanceMm.toFixed(1)),
    chainReductionRatio: Number(chainReductionRatio.toFixed(2)),
    wheelRpm: Math.round(wheelRpm),
    wheelLinearSpeedMs: Number(wheelLinearSpeedMs.toFixed(2)),
    axleRatedTorqueNm: Number(axleRatedTorqueNm.toFixed(2)),
    axleStallTorqueNm: Number(axleStallTorqueNm.toFixed(2)),
    motorTractiveForceN: Number(motorTractiveForceN.toFixed(1)),
    adhesionLimitN: Number(adhesionLimitN.toFixed(1)),
    clearanceOk: railClearanceMm >= 5.0,
  };
}

/**
 * Audits core mechanical/energy costs against the strict R$ 200,00 budget cap,
 * keeping free 3D printing at R$ 0 and excluding Remote Control from the R$ 200 ceiling.
 */
export function calculateBudgetSummary(
  items: BudgetLocomotiveItem[],
  budgetCapBrl = 200
): BudgetAuditSummary {
  const coreTotalBrl = items
    .filter((i) => i.category === 'core_budget')
    .reduce((sum, i) => sum + i.unitCostBrl, 0);

  const remoteControlTotalBrl = items
    .filter((i) => i.category === 'remote_control_excluded')
    .reduce((sum, i) => sum + i.unitCostBrl, 0);

  const free3dMassG = items
    .filter((i) => i.category === 'free_3d_print')
    .reduce((sum, i) => sum + i.massG, 0);

  const purchasedMassG = items
    .filter((i) => i.category !== 'free_3d_print')
    .reduce((sum, i) => sum + i.massG, 0);

  const remainingMarginBrl = Number((budgetCapBrl - coreTotalBrl).toFixed(2));

  return {
    budgetCapBrl,
    coreTotalBrl: Number(coreTotalBrl.toFixed(2)),
    remainingMarginBrl,
    withinBudgetCap: coreTotalBrl <= budgetCapBrl,
    remoteControlTotalBrl: Number(remoteControlTotalBrl.toFixed(2)),
    grandTotalWithRcBrl: Number((coreTotalBrl + remoteControlTotalBrl).toFixed(2)),
    free3dMassG,
    purchasedMassG,
    totalEstimatedMassG: free3dMassG + purchasedMassG,
  };
}
