import { Shift, ShiftPremium } from "@/lib/types";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { useEffect, useState } from "react";

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

    function calculateOverlap(aShift: Shift, aPremium: Shift): Shift
    {
        let startTime = Math.max(aShift.startTime, aPremium.startTime);
        let endTime = Math.min(aShift.endTime, aPremium.endTime);

        if(startTime > endTime)
            startTime = endTime;

        return {startTime: startTime, endTime: endTime};
    }

    function getHoursFromShift(aShift: Shift)
    {
        return (aShift.endTime - aShift.startTime) / 60;
    }

    function calculateSalary()
    {
        let salary = 0;

        shifts.forEach((shift, date) => {
            salary += getHoursFromShift(shift) * hourRate;

            month.setDate(date);
            premiums.get(month.getDay())?.forEach((premium) => {
                salary += getHoursFromShift(calculateOverlap(shift, premium.shift)) * premium.premium;
            });
        });

        setSalary(salary);
    }

    useEffect(() => {
        calculateSalary();
    }, [shifts, premiums])

    return (
        <div>
            <h2>Timelønnen er {hourRate}kr</h2>
            <h2>Skatteprosenten ligger på {taxRate * 100}%</h2>
            <h1>Bruttolønn i {monthString} er {salary.toFixed(2)}kr</h1>
            <h1>Nettolønn i {monthString} er {(salary * (1 - taxRate)).toFixed(2)}</h1>
        </div>
    );
}