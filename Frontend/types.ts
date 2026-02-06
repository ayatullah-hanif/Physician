export interface KinematicData {
  mass_estimation: string;
  friction_coefficient: string;
  center_of_mass: string;
}

export interface LogicGate {
  safety_constraints: string[];
  adjustments_required: string[];
  final_verdict: 'OPEN' | 'CLOSED';
}

export interface ForensicReport {
  failure_signature: string;
  primary_law_violated: string;
  reconstruction_analysis: string;
  governor_patch: string;
}

export interface PhysicianAnalysis {
  agent_type: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  logic_trace: string;
  physics_overrides: { parameter: string; value: string }[];
  kinematics: KinematicData;
  contextual_risks: string[];
  logic_gate: LogicGate;
  simulation_outcome: string;
  forensic_report?: ForensicReport;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'CRIT' | 'SYS';
  message: string;
}

export enum ViewMode {
  VISUAL = 'VISUAL',
  JSON = 'JSON',
}