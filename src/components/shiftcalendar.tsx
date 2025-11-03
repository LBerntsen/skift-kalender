"use client"

import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { nb } from "date-fns/locale"
import { useState, useEffect } from "react"
import TimeInput from "./timeinput"
import { formatTime } from "@/lib/utility"
import ShiftPremiumEditor from "./shiftpremiumeditor"
import { Shift, ShiftPremium } from "@/lib/types"
import SalarySummary from "./salarysummary"

export default function ShiftCalendar() {
  const [month, setMonth] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [shifts, setShifts] = useState<Map<string, Map<number, Shift>>>(new Map());
  const [premiums, setPremiums] = useState<Map<number, ShiftPremium[]>>(new Map());    

  useEffect(() => {
    setSelectedDate(undefined);
  }, [month]);

  function getMonthKey()
  {
    return (month.getMonth() + 1).toString() + month.getFullYear().toString();
  }

  function getDayKey()
  {
    return selectedDate?.getDate() ?? -1;
  }

  function getShift(aDay: number): Shift | undefined
  {
    return shifts.get(getMonthKey())?.get(aDay);
  }

  function updateShiftStart(aTime: number)
  {
    setShifts(prev => {
      const newShifts = new Map(prev);
      const month = new Map(newShifts.get(getMonthKey()) ?? new Map());
      const oldShift = month.get(getDayKey());
      let newShift: Shift;
      if(oldShift)
      {
        newShift = structuredClone(oldShift);
        newShift.startTime = aTime;
      }
      else
      {
        newShift = {startTime: aTime, endTime: 0}
      }

      if(newShift.endTime < newShift.startTime)
        newShift.endTime = newShift.startTime;

      month.set(getDayKey(), newShift);
      newShifts.set(getMonthKey(), month);

      return newShifts;
    })
  }

  function updateShiftEnd(aTime: number)
  {
    setShifts(prev => {
      const newShifts = new Map(prev);
      const month = new Map(newShifts.get(getMonthKey()) ?? new Map());
      const oldShift = month.get(getDayKey());
      let newShift: Shift;
      if(oldShift)
      {
        newShift = structuredClone(oldShift);
        newShift.endTime = aTime;
      }
      else
      {
        newShift = {startTime: 0, endTime: aTime}
      }
      month.set(getDayKey(), newShift);
      newShifts.set(getMonthKey(), month);

      return newShifts;
    })
  }

  return (
    <div className="flex justify-around">
      <Card>
        <CardHeader>
          <SalarySummary month={month} shifts={shifts.get(getMonthKey()) ?? new Map()} premiums={premiums}/>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} month={month} onMonthChange={setMonth} className="bg-transparent p-0" locale={nb} showOutsideDays={false} components={{
            DayButton: ({ children, modifiers, day, ...props }) => {
              const shift = getShift(day.date.getDate());
              return (
                <CalendarDayButton day={day} modifiers={modifiers} {...props} className="w-20 h-20 p-2">
                  {children}
                  {(shift && shift.endTime - shift.startTime > 0) && <span>{formatTime(shift.startTime)}-{formatTime(shift.endTime)}</span>}
                </CalendarDayButton>
              )
          },
          }}
          />
        </CardContent>
        {selectedDate && ShiftEditor()}
      </Card>
      <ShiftPremiumEditor premiums={premiums} setPremiums={setPremiums}/>
    </div>
  )

  function ShiftEditor()
  {
    const shift = getShift(getDayKey());
    return (
      <CardFooter className="flex flex-row gap-6 border-t px-4 !pt-4">
        <TimeInput label="Start Time" time={shift ? shift.startTime : 0} setTime={updateShiftStart}/>
        <TimeInput label="End Time" time={shift ? shift.endTime : 0} setTime={updateShiftEnd}/>
      </CardFooter>
    );
  }
}