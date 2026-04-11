"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { X } from "lucide-react";

const LogsFilter = ({
  users,
  selectedUsers,
  onUsersChange,
  customers,
  selectedCompanyId,
  onCompanyChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onResetFilters,
}: {
  users: string[];
  selectedUsers: string[];
  onUsersChange: (users: string[]) => void;
  customers: { id: number; name: string }[];
  selectedCompanyId: number | null;
  onCompanyChange: (id: number | null) => void;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onDateFromChange: (d: Date | undefined) => void;
  onDateToChange: (d: Date | undefined) => void;
  onResetFilters: () => void;
}) => {
  const isAllUsers = selectedUsers.length === 0;

  const handleUserChange = (user: string, checked: boolean) => {
    const current = new Set(selectedUsers);
    if (checked) current.add(user);
    else current.delete(user);
    onUsersChange(Array.from(current));
  };

  const hasActiveFilters =
    selectedUsers.length > 0 ||
    selectedCompanyId !== null ||
    dateFrom !== undefined ||
    dateTo !== undefined;

  const resetAll = () => {
    onUsersChange([]);
    onCompanyChange(null);
    onDateFromChange(undefined);
    onDateToChange(undefined);
    onResetFilters();
  };

  return (
    <div className="mb-6 p-4 border border-dashed rounded-xl space-y-4">
      {/* User filter */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="text-sm font-medium text-muted-foreground w-32">
          تصفية بالمستخدم:
        </span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="filter-all-users"
              checked={isAllUsers}
              onCheckedChange={() => onUsersChange([])}
            />
            <Label htmlFor="filter-all-users">الكل</Label>
          </div>
          {users.map((user) => (
            <div key={user} className="flex items-center gap-2">
              <Checkbox
                id={`filter-user-${user}`}
                checked={selectedUsers.includes(user)}
                onCheckedChange={(checked) => handleUserChange(user, !!checked)}
              />
              <Label htmlFor={`filter-user-${user}`}>{user}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Company + Date filters */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {/* Company */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground w-32">
            تصفية بالشركة:
          </span>
          <Select
            dir="rtl"
            value={selectedCompanyId !== null ? `${selectedCompanyId}` : "all"}
            onValueChange={(v) =>
              onCompanyChange(v === "all" ? null : Number(v))
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="الكل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {customers.map((c) => (
                <SelectItem key={c.id} value={`${c.id}`}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date from */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground w-32">
            تصفية من تاريخ:
          </span>
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-36 justify-start font-normal"
                >
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "اختر تاريخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={onDateFromChange}
                />
              </PopoverContent>
            </Popover>
            {dateFrom && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => onDateFromChange(undefined)}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Date to */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground w-32">
            تصفية الى تاريخ:
          </span>
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-36 justify-start font-normal"
                >
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "اختر تاريخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={onDateToChange}
                />
              </PopoverContent>
            </Popover>
            {dateTo && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => onDateToChange(undefined)}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Reset all */}
        {hasActiveFilters && (
          <Button variant="destructive" size="sm" onClick={resetAll}>
            مسح الفلاتر
          </Button>
        )}
      </div>
    </div>
  );
};

export default LogsFilter;
