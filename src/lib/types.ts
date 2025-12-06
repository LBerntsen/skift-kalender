export interface TimeInterval
{
  startTime: number;
  endTime: number;
}

export interface Shift
{
  shiftInterval: TimeInterval;
  breakInterval: TimeInterval;
}

export interface ShiftPremium
{
  interval: TimeInterval;
  premium: number;
}