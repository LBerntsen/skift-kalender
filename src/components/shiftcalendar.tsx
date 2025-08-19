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
import { CalendarDay } from "react-day-picker"

interface Shift
{
  //startTime: number;
  //endTime: number;
}

export default function ShiftCalendar() {
  const [month, setMonth] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [shifts, setShifts] = useState<Map<string, Map<number, Shift>>>(new Map());

  useEffect(() => {
    setShifts(new Map([["82025", new Map([[3, {}]])]]))
  }, [month]);

  function shiftExists(aDay: CalendarDay)
  {
    let key = (month.getMonth() + 1).toString() + month.getFullYear().toString();
    let shiftMonth = shifts.get(key);
    if(shiftMonth)
    {
      let shift = shiftMonth.get(aDay.date.getDate());
      if(shift)
        return true;
    }

    return false;
  }

  return (
    <Card className="w-fit py-4">
      <CardHeader>
        <h1>Lønn i {format(month, "MMMM", {locale: nb})} er 19000kr</h1>
      </CardHeader>
      <CardContent className="px-4">
        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} month={month} onMonthChange={setMonth} className="bg-transparent p-0" locale={nb} showOutsideDays={false} components={{
          DayButton: ({ children, modifiers, day, ...props }) => {
          const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6
          return (
            <CalendarDayButton day={day} modifiers={modifiers} {...props} className="p-2">
              {children}
              <span>11:30-16:50</span>
              {/*{!modifiers.outside && <span>{isWeekend ? "$220" : "$100"}</span>}*/}
              <span>{shiftExists(day) ? "Exist": "no exist"}</span>
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
                defaultValue="10:30"
                onChange={e => console.log(e.target.value)}
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
                defaultValue="12:30"
                className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

function Test()
{
  return (
    <h1>TESTING</h1>
  );
}

/*
      <h1>Lønn i {format(month, "MMMM", {locale: nb})} er x</h1>
      <Calendar mode="single" month={month} onMonthChange={setMonth} selected={selectedDate} onSelect={setSelectedDate} locale={nb}/>
      <ShiftCalendar/>
      <Dialog open={selectedDate ? true : false}>
      <form>
        <DialogContent onPointerDownOutside={() => setSelectedDate(undefined)} className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          test
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setSelectedDate(undefined)}>Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
*/