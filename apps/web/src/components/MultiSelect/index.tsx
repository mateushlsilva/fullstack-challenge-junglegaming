"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandEmpty
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

type Option = {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    onEndReached?: () => void;
}

export function MultiSelect({ options, value, onChange, placeholder = "Selecione...", onEndReached }: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)

    const toggle = (v: string) => {
        if (value.includes(v)) {
            onChange(value.filter((item) => item !== v))
        } else {
            onChange([...value, v])
        }
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;

        const isBottom =
            target.scrollTop + target.clientHeight >= target.scrollHeight - 20;

        if (isBottom && onEndReached) {
            onEndReached();
        }
    };


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-60 justify-between bg-[#1A1A1A] border-gray-700 text-[#737373]"
                >
                    {value.length === 0
                        ? placeholder
                        : `${value.length} selecionado(s)`
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-60 p-0 bg-[#1A1A1A]">
                <Command>
                    <CommandList className="bg-[#1A1A1A] text-white">
                        <CommandEmpty>Nenhum item encontrado.</CommandEmpty>

                        <ScrollArea className="max-h-64" onScroll={handleScroll}>
                            <CommandGroup>
                                {options.map((opt) => (
                                    <CommandItem
                                        key={opt.value}
                                        onSelect={() => toggle(opt.value)}
                                        className="cursor-pointer text-white"
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-gray-700",
                                                value.includes(opt.value) && "bg-indigo-600 border-indigo-600"
                                            )}
                                        >
                                            {value.includes(opt.value) && (
                                                <Check className="h-3 w-3 text-white" />
                                            )}
                                        </div>
                                        {opt.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </ScrollArea>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
