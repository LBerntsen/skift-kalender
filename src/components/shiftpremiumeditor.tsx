import { addDays, eachDayOfInterval, format, parse, startOfISOWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import TimeInput from "./timeinput";
import NumberInput from "./numberinput";
import { Button } from "./ui/button";
import { ShiftPremium } from "@/lib/types";

interface ShiftPremiumEditorProps
{
    premiums: Map<number, ShiftPremium[]>
    setPremiums: Dispatch<SetStateAction<Map<number, ShiftPremium[]>>>
}

export default function ShiftPremiumEditor({premiums, setPremiums}: ShiftPremiumEditorProps)
  {
    const firstDay = startOfISOWeek(new Date());
    const daysOfWeekDates = eachDayOfInterval({start: firstDay, end: addDays(firstDay, 6)});

    const [currentDay, setCurrentDay] = useState(firstDay.getDay());

    function onAddPremium()
    {
      setPremiums(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(currentDay) ?? [];

        newMap.set(currentDay, [...existing, {shift: {startTime: 0, endTime: 0}, premium: 0}]);
        return newMap;
      });
    }

    function onPremiumStartTimeChanged(aTime: number, aIndex: number)
    {
      setPremiums(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(currentDay) ?? [];

        const updatedArray = [...existing];
        const updatedItem = {...updatedArray[aIndex]};
        const updatedShift = {...updatedItem.shift, startTime: aTime};
        updatedItem.shift = updatedShift;
        updatedArray[aIndex] = updatedItem;

        newMap.set(currentDay, updatedArray);
        return newMap;
      });
    }

    function onPremiumEndTimeChanged(aTime: number, aIndex: number)
    {
      setPremiums(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(currentDay) ?? [];

        const updatedArray = [...existing];
        const updatedItem = {...updatedArray[aIndex]};
        const updatedShift = {...updatedItem.shift, endTime: aTime};
        updatedItem.shift = updatedShift;
        updatedArray[aIndex] = updatedItem;

        newMap.set(currentDay, updatedArray);
        return newMap;
      });
    }

    function onPremiumChanged(aPremium: number, aIndex: number)
    {
      setPremiums(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(currentDay) ?? [];

        const updatedArray = [...existing];
        const updatedItem = {...updatedArray[aIndex], premium: aPremium};
        updatedArray[aIndex] = updatedItem;

        newMap.set(currentDay, updatedArray);
        return newMap;
      });
    }

    function getDayOfWeekString(aDate: Date)
    {
      return format(aDate, "eee", {locale: nb});
    }

    function getDayOfWeekNumber(aDay: string)
    {
      return parse(aDay, "eee", new Date(), {locale: nb}).getDay();
    }

    function getDateFromDayNumber(aDay: number)
    {
      const now = new Date();
      const currentDay = now.getDay();
      const result = new Date(now);
      result.setDate(now.getDate() + (aDay - currentDay));
      return result;
    }

    return (
      <Card className="w-lg">
        <Tabs defaultValue={getDayOfWeekString(daysOfWeekDates[0])} value={getDayOfWeekString(getDateFromDayNumber(currentDay))} onValueChange={(day) => setCurrentDay(getDayOfWeekNumber(day))}>
          <CardHeader className="text-center mb-4">
            <CardTitle>Skifttillegg</CardTitle>
            <TabsList className="w-full">
              {daysOfWeekDates.map((day) => (
                <TabsTrigger value={getDayOfWeekString(day)} key={day.toString()}>{getDayOfWeekString(day)}</TabsTrigger>
              ))}
            </TabsList>
          </CardHeader>
          <CardContent>
            {daysOfWeekDates.map((day) => (
                <TabsContent value={getDayOfWeekString(day)} key={day.toString()} className="flex flex-col gap-4">
                  {premiums.get(day.getDay())?.map((premium, index) =>
                    <div className="flex justify-between gap-4" key={index}>
                      <TimeInput label="Fra" time={premium.shift.startTime} setTime={(time) => {onPremiumStartTimeChanged(time, index)}} gap={1}/>
                      <TimeInput label="Til" time={premium.shift.endTime} setTime={(time) => {onPremiumEndTimeChanged(time, index)}} gap={1}/>
                      <NumberInput label="Tillegg" value={premium.premium} setValue={(premium) => {onPremiumChanged(premium, index)}} gap={1}/>
                    </div>
                  )}
                </TabsContent>
            ))}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={onAddPremium}>Legg til skifttillegg</Button>
          </CardFooter>
        </Tabs>
      </Card>
    );
  }