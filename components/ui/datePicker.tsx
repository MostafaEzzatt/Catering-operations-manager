"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { arEG } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

// Full-width button showing the date as "DD / MM / YYYY" (like the reports),
// opening an Arabic, right-to-left calendar that closes once a day is picked
export function DatePicker({
  id,
  date,
  setDate,
  maxDate,
}: {
  // For a <label htmlFor>; a unique id is generated when omitted
  id?: string;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  // Days after this one are greyed out and can't be picked
  maxDate?: Date;
}) {
  const generatedId = React.useId();
  const [open, setOpen] = React.useState(false);

  return (
    <Field className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id ?? generatedId}
            className="w-full justify-between font-normal"
          >
            {date ? (
              // Left-to-right, or the RTL page shows "YYYY / MM / DD"
              <bdi dir="ltr">{format(date, "dd / MM / yyyy")}</bdi>
            ) : (
              <span className="text-muted-foreground">اختر التاريخ</span>
            )}
            <CalendarIcon className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            required
            selected={date}
            onSelect={(picked) => {
              setDate(picked);
              setOpen(false);
            }}
            defaultMonth={date}
            disabled={maxDate ? { after: maxDate } : undefined}
            // Arabic month and day names, Western digits, week from Sunday
            locale={arEG}
            dir="rtl"
            // 44px cells (default 32px): Arabic weekday names such as
            // أربعاء are wider than the default and ran into each other
            className="[--cell-size:--spacing(11)]"
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
