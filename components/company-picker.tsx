"use client";

import { cutomersTable } from "@/drizzle/db/schema";
import { searchCompanies } from "@/lib/arabic";
import { cn } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Company = Pick<InferSelectModel<typeof cutomersTable>, "id" | "name" | "code">;

// Picks one company. A full-width button opens a search (by name or code)
// over the companies, listed in the order given. A value of 0 means none is
// picked. Enter in the search picks the first match.
const CompanyPicker = ({
  id,
  companies,
  value,
  onChange,
  invalid,
}: {
  id?: string;
  companies: Company[];
  value: number;
  onChange: (companyId: number) => void;
  invalid?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const visible = searchCompanies(companies, search);
  const selected = companies.find((c) => c.id === value);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    // Start every visit with the full list
    if (!nextOpen) setSearch("");
  }

  function pick(companyId: number) {
    onChange(companyId);
    handleOpenChange(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className="w-full justify-between font-normal"
          disabled={companies.length === 0}
          aria-invalid={invalid}
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected?.name ??
              (companies.length === 0 ? "لا توجد شركات" : "اختر الشركة")}
          </span>
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      {/* Same width as the trigger, which fills the field */}
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) p-0"
        dir="rtl"
      >
        <div className="p-2 border-b">
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              // Never submit the surrounding form from the search box
              e.preventDefault();
              if (visible.length > 0) pick(visible[0].id);
            }}
            placeholder="بحث بالاسم او الكود"
            aria-label="بحث عن شركة"
            autoComplete="off"
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {visible.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              لا توجد شركات مطابقة.
            </p>
          )}
          {visible.map((c) => {
            const isSelected = c.id === value;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => pick(c.id)}
                aria-pressed={isSelected}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-start outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
              >
                <Check
                  className={cn(
                    "size-4 shrink-0",
                    isSelected ? "opacity-100" : "opacity-0",
                  )}
                />
                <span className="flex-1 truncate">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.code}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CompanyPicker;
