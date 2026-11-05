"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { DatePicker } from "./ui/datePicker";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Spinner } from "./ui/spinner";

// "YYYY-MM-DD" as local midnight. new Date("YYYY-MM-DD") would be UTC
// midnight, which is the previous day in time zones west of UTC.
function toLocalDate(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// The range lives in the URL (/?from=YYYY-MM-DD&to=YYYY-MM-DD) and the server
// filters by it. Mount with a key of the range so back/forward resets the
// pickers to the URL's dates.
const FlightCountFilter = ({
  from,
  to,
  isDefault,
}: {
  from: string;
  to: string;
  isDefault: boolean;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dateFrom, setDateFrom] = useState(() => toLocalDate(from));
  const [dateTo, setDateTo] = useState(() => toLocalDate(to));
  const [error, setError] = useState("");

  function navigate(href: string) {
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextFrom = format(dateFrom, "yyyy-MM-dd");
    const nextTo = format(dateTo, "yyyy-MM-dd");

    if (nextFrom > nextTo) {
      setError("تاريخ البداية يجب ان يكون قبل تاريخ النهاية");
      return;
    }

    setError("");
    navigate(`/?${new URLSearchParams({ from: nextFrom, to: nextTo })}`);
  }

  return (
    <form id="flight-count-filter" onSubmit={handleSubmit} className="mb-4">
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="filter-from" className="capitalize">
              من تاريخ
            </FieldLabel>
            <DatePicker
              id="filter-from"
              date={dateFrom}
              setDate={(d) => {
                setDateFrom(d);
                setError("");
              }}
            />
          </Field>
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor="filter-to" className="capitalize">
              الى تاريخ
            </FieldLabel>
            <DatePicker
              id="filter-to"
              date={dateTo}
              setDate={(d) => {
                setDateTo(d);
                setError("");
              }}
            />
            {!!error && <FieldError errors={[{ message: error }]} />}
          </Field>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />} عرض
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isPending || isDefault}
            onClick={() => navigate("/")}
          >
            الشهر الحالى
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default FlightCountFilter;
