import { TimeInterval, Shift, ShiftPremium } from "@/lib/types";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { formatTime } from "@/lib/utility";

interface SalarySummaryProps
{
    month: Date
    shifts: Map<number, Shift>
    premiums: Map<number, ShiftPremium[]>
}

export default function SalarySummary({month, shifts, premiums}: SalarySummaryProps)
{
    const [hourRate, setHourRate] = useState(100);
    const [taxRate, setTaxRate] = useState(0.25);
    const [salary, setSalary] = useState(0);

    const monthString = format(month, "MMMM", {locale: nb});

    function calculateOverlap(aShift: TimeInterval, aPremium: TimeInterval): TimeInterval
    {
        let startTime = Math.max(aShift.startTime, aPremium.startTime);
        let endTime = Math.min(aShift.endTime, aPremium.endTime);

        if(startTime > endTime)
            startTime = endTime;

        return {startTime: startTime, endTime: endTime};
    }

    function getHoursFromInterval(aInterval: TimeInterval)
    {
        return (aInterval.endTime - aInterval.startTime) / 60;
    }

    function calculateSalaryFromInterval(aShiftInterval: TimeInterval, aDate: number)
    {
        let salary = 0;

        salary += getHoursFromInterval(aShiftInterval) * hourRate;

        month.setDate(aDate);
        premiums.get(month.getDay())?.forEach((premium) => {
            salary += getHoursFromInterval(calculateOverlap(aShiftInterval, premium.interval)) * premium.premium;
        })

        return salary;
    }

    function calculateSalary()
    {
        let salary = 0;

        shifts.forEach((shift, date) => {
            if(getHoursFromInterval(shift.breakInterval) > 0)
            {
                const firstInterval: TimeInterval = {startTime: shift.shiftInterval.startTime, endTime: shift.breakInterval.startTime};
                const secondInterval: TimeInterval = {startTime: shift.breakInterval.endTime, endTime: shift.shiftInterval.endTime};

                salary += calculateSalaryFromInterval(firstInterval, date);
                salary += calculateSalaryFromInterval(secondInterval, date);
            }
            else
            {
                salary += calculateSalaryFromInterval(shift.shiftInterval, date);
            }
        });

        setSalary(salary);
    }

    function generateICS()
    {
        const header = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ShiftApp//EN
CALSCALE:GREGORIAN
`

        const footer = `END:VCALENDAR`;

        let text = header;
        
        shifts.forEach((shift, date) => {
            const dayStamp = month.getFullYear().toString() + month.getMonth().toString();
            const startTime = formatTime(shift.shiftInterval.startTime).replace(":", "");
            const endTime = formatTime(shift.shiftInterval.endTime).replace(":", "");

            text += `BEGIN:VEVENT
UID:shift-${dayStamp}${date}@shiftapp
DTSTAMP:${dayStamp}${date}T${startTime}00
DTSTART:${dayStamp}${date}T${startTime}00
DTEND:${dayStamp}${date}T${endTime}00
SUMMARY:Vakt
DESCRIPTION:
END:VEVENT
`
        });

        text += footer;

        return text;
    }

    function downloadCalendar()
    {
        const text = generateICS();
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "skiftplan.ics";
        a.click();

        URL.revokeObjectURL(url);
    }

    useEffect(() => {
        calculateSalary();
    }, [shifts, premiums])

    return (
        <div className="flex justify-between">
            <div>
                <h2>Timelønnen er {hourRate}kr</h2>
                <h2>Skatteprosenten ligger på {taxRate * 100}%</h2>
                <h1>Bruttolønn i {monthString} er {salary.toFixed(2)}kr</h1>
                <h1>Nettolønn i {monthString} er {(salary * (1 - taxRate)).toFixed(2)}</h1>
            </div>
            <Button onClick={downloadCalendar}>Last ned i kalender</Button>
        </div>
    );
}