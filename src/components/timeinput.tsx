"use client"

import { Clock2Icon } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { formatTime, parseTime } from "@/lib/utility";

interface TimeInputProps
{
    label: string
    time: number
    setTime: (time: number) => void
    gap?: number
}

export default function TimeInput({label, time, setTime, gap} : TimeInputProps)
{
    const id = "time-" + label.trim().replaceAll(" ", "").toLowerCase();
    
    if(!gap)
        gap = 3

    return (
        <div className={`flex w-full flex-col gap-${gap}`}>
            <Label htmlFor={id}>{label}</Label>
            <div className="relative flex w-full items-center gap-2">
                <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
                <Input 
                    id={id}
                    type="time"
                    step={60}
                    value={formatTime(time)}
                    onChange={e => setTime(parseTime(e.target.value))}
                    className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
            </div>
        </div>
    );
}