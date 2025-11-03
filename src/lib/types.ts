export interface Shift
{
  startTime: number;
  endTime: number;
}

export interface ShiftPremium
{
  shift: Shift;
  premium: number;
}