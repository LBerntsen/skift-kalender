"use client"

import * as React from "react"
import { Clock2Icon } from "lucide-react"

import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { nb } from "date-fns/locale"
import { useState, useEffect } from "react"
import { format } from "date-fns"

interface Shift
{
  startTime: number;
  endTime: number;
}

function parseTime(aTimeString: string)
{
  const timeParts = aTimeString.split(":");
  return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
}

function formatTime(aTimeNumber: number)
{
  const minutes = aTimeNumber % 60;
  const hours = (aTimeNumber - minutes) / 60

  const minutesString = minutes > 9 ? minutes.toString() : `0${minutes.toString()}`;
  const hoursString = hours > 9 ? hours.toString() : `0${hours.toString()}`;

  return `${hoursString}:${minutesString}`;
}

export default function ShiftCalendar() {
  const [month, setMonth] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [shifts, setShifts] = useState<Map<string, Map<number, Shift>>>(new Map());
  const [salary, setSalary] = useState(0);
  const [hourRate, setHourRate] = useState(100);
  const [taxRate, setTaxRate] = useState(0.5);

  useEffect(() => {
    setShifts(new Map([["82025", new Map([[3, {startTime: 242, endTime: 124}]])]]))
  }, [month]);

  function getMonthKey()
  {
    return (month.getMonth() + 1).toString + month.getFullYear().toString();
  }

  function getDayKey()
  {
    return selectedDate?.getDate() ?? -1;
  }

  function shiftExists(aDay: number)
  {
    let shiftMonth = shifts.get(getMonthKey());
    if(shiftMonth)
    {
      let shift = shiftMonth.get(aDay);
      if(shift)
        return true;
    }

    return false;
  }

  function getShift(aDay: number)
  {
    let shiftMonth = shifts.get(getMonthKey());
    if(shiftMonth)
    {
      let shift = shiftMonth.get(aDay);
      if(shift)
        return shift;
    }

    return null;
  }

  function updateShiftStart(aTime: string)
  {
    setShifts(prev => {
      const newShifts = new Map(prev);
      const month = new Map(newShifts.get(getMonthKey()) ?? new Map());
      const oldShift = month.get(getDayKey());
      let newShift: Shift;
      if(oldShift)
      {
        newShift = structuredClone(oldShift);
        newShift.startTime = parseTime(aTime);
      }
      else
      {
        newShift = {startTime: parseTime(aTime), endTime: parseTime("00:00")}
      }

      if(newShift.endTime < newShift.startTime)
        newShift.endTime = newShift.startTime;

      month.set(getDayKey(), newShift);
      newShifts.set(getMonthKey(), month);

      return newShifts;
    })
  }

  function updateShiftEnd(aTime: string)
  {
    setShifts(prev => {
      const newShifts = new Map(prev);
      const month = new Map(newShifts.get(getMonthKey()) ?? new Map());
      const oldShift = month.get(getDayKey());
      let newShift: Shift;
      if(oldShift)
      {
        newShift = structuredClone(oldShift);
        newShift.endTime = parseTime(aTime);
      }
      else
      {
        newShift = {startTime: parseTime("00:00"), endTime: parseTime(aTime)}
      }
      month.set(getDayKey(), newShift);
      newShifts.set(getMonthKey(), month);

      return newShifts;
    })
  }

  useEffect(() => {
    const month = shifts.get(getMonthKey());
    if(month)
    {
      let newSalary = 0;
      month.forEach((shift) => {
        let time = shift.endTime - shift.startTime;
        newSalary += hourRate * (time / 60);
      });
      setSalary(newSalary);
    }
  }, [shifts])

  return (
    <Card className="w-fit py-4">
      <CardHeader>
        <h1>Lønn i {format(month, "MMMM", {locale: nb})} er {salary * (1 - taxRate)}kr</h1>
        <h2>Timelønnen er {hourRate}kr</h2>
        <h2>Skatteprosenten ligger på {taxRate * 100}%</h2>
      </CardHeader>
      <CardContent className="px-4">
        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} month={month} onMonthChange={setMonth} className="bg-transparent p-0" locale={nb} showOutsideDays={false} components={{
          DayButton: ({ children, modifiers, day, ...props }) => {
          const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6 // TODO fjern denne
          return (
            <CalendarDayButton day={day} modifiers={modifiers} {...props} className="w-20 h-20 p-2">
              {children}
              {shiftExists(day.date.getDate()) && <span>{shiftExists(day.date.getDate()) && formatTime(getShift(day.date.getDate())?.startTime ?? 0)}-{shiftExists(day.date.getDate()) && formatTime(getShift(day.date.getDate())?.endTime ?? 0)}</span>}
            </CalendarDayButton>
          )
        },
        }}
        />
      </CardContent>
      {selectedDate && (
        <CardFooter className="flex flex-col gap-6 border-t px-4 !pt-4">
          <div className="flex w-full flex-col gap-3">
            <Label htmlFor="time-from">Start Time</Label>
            <div className="relative flex w-full items-center gap-2">
              <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
              <Input
                id="time-from"
                type="time"
                step="60"
                defaultValue="00:00"
                onChange={e => updateShiftStart(e.target.value)}
                className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-3">
            <Label htmlFor="time-to">End Time</Label>
            <div className="relative flex w-full items-center gap-2">
              <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
              <Input
                id="time-to"
                type="time"
                step="60"
                defaultValue="00:00"
                onChange={e => updateShiftEnd(e.target.value)}
                className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}