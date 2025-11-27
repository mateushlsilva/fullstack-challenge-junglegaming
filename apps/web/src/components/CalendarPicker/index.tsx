"use client";

import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function CalendarPicker({ value, onChange }: { value?: Date; onChange?: (date: Date) => void }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-60 justify-start text-left font-normal bg-[#1A1A1A] border-gray-700 text-white",
            !value && "text-gray-400"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? value.toLocaleDateString() : "Selecione uma data"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-[#1A1A1A] border-gray-700 text-white">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date: Date) => {
            onChange!(date);
            setOpen(false);
          }}
          className="rounded-md border border-gray-700 bg-[#111] text-white"
          classNames={{ selected: 'bg-white text-white' }}
          required
        />
      </PopoverContent>
    </Popover>
  );
}
