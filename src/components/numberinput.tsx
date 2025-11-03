import { CircleDollarSign } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";

interface NumberInputProps
{
    label: string
    value: number
    setValue: (value: number) => void
    gap?: number
}

export default function NumberInput({label, value, setValue, gap}: NumberInputProps)
{
    const id = "number-" + label.trim().replaceAll(" ", "").toLowerCase();

    if(!gap)
        gap = 3

    const [internalValue, setInternalValue] = useState(value);
    const [displayValue, setDisplayValue] = useState(String(internalValue));

    useEffect(() => {
        setDisplayValue(value.toString());
        setInternalValue(value);
    }, [value])

    function onInputChanged(input: string)
    {
        if(input === "" || input === "0")
        {
            setDisplayValue("0");
            setInternalValue(0);
            setValue(0);
            return;
        }

        if(/^\d*\.?\d*$/.test(input))
        {
            if(!input.startsWith("0.") && input.length > 1)
            {
                input = input.replace(/^0+/, "");
                if(input.length === 0)
                    input = "0";
            }

            setDisplayValue(input);

            const numberValue = Number(input);
            if(!isNaN(numberValue)) 
            {
                setInternalValue(numberValue);
                setValue(numberValue);
            }
        }
    }

    return (
        <div className={`flex w-full flex-col gap-${gap}`}>
            <Label htmlFor={id}>{label}</Label>
            <div className="relative flex w-full items-center gap-2">
                <CircleDollarSign className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none"/>
                <Input
                    id={id}
                    type="text"
                    value={displayValue}
                    onChange={(e) => onInputChanged(e.target.value)}
                    className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"/>
            </div>
        </div>
    );
}