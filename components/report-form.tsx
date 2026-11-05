"use client";
import { reportAction } from "@/actions/report";
import { DatePicker } from "@/components/ui/datePicker";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cutomersTable } from "@/drizzle/db/schema";
import { formSchema, ReportPeriod } from "@/formsSchema/report-flights";
import { InferSelectModel } from "drizzle-orm";
import { ChevronDown } from "lucide-react";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import ReportTable, { ReportPrintMeta } from "./report-table";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Spinner } from "./ui/spinner";

type CompanyType = "0" | "1" | "2";
type ReportField = "from" | "to" | "period" | "companyType" | "companyIds";
type FieldErrors = Partial<Record<ReportField, { message: string }[]>>;

const ar_field_name: Record<ReportField, string> = {
  from: "من",
  to: "الى",
  period: "نوع التقرير",
  companyType: "تحديد الشركة",
  companyIds: "الشركات",
};

const COMPANY_TYPE_OPTIONS: {
  value: CompanyType;
  label: string;
  description: string;
}[] = [
  {
    value: "0",
    label: "حدد شركات",
    description: "اختر شركة او اكثر للتقرير.",
  },
  {
    value: "1",
    label: "الشركات الاجنبية",
    description: "الشركات الاجنبية فقط.",
  },
  { value: "2", label: "جميع الشركات", description: "تحديد كل الشركات." },
];

const PERIOD_OPTIONS: {
  value: ReportPeriod;
  label: string;
  description: string;
}[] = [
  { value: "day", label: "تقرير يومى", description: "صف لكل يوم مسجل." },
  {
    value: "month",
    label: "تقرير شهرى",
    description: "مجموع شهرى لكل شركة على حدى.",
  },
  {
    value: "year",
    label: "تقرير سنوى",
    description: "مجموع سنوى لكل شركة على حدى.",
  },
];

// "DD / MM / YYYY" in the user's local calendar (the picked dates are local)
const formatDay = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(d)
    .replace(/\//g, " / ");

// Deliberately NOT built on @tanstack/react-form: a TanStack form next to
// Radix inputs (RadioGroup, Select, Popover) can trigger a synchronous render
// loop on React 19 that freezes the tab (TanStack/form#2020). Plain state plus
// zod safeParse, the same pattern as update-flight-count.tsx, avoids it.
const Reportform = ({
  customers,
}: {
  customers: InferSelectModel<typeof cutomersTable>[];
}) => {
  const [transitionPending, startTransition] = useTransition();
  const [state, submit, submitIsPending] = useActionState(reportAction, null);
  const pending = transitionPending || submitIsPending;

  const [dateFrom, setDateFrom] = useState(() => new Date());
  const [dateTo, setDateTo] = useState(() => new Date());
  const [period, setPeriod] = useState<ReportPeriod>("day");
  const [companyType, setCompanyType] = useState<CompanyType>("0");
  const [companyIds, setCompanyIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [printMeta, setPrintMeta] = useState<ReportPrintMeta | null>(null);

  useEffect(() => {
    if (pending) {
      toast.info("بدء عملية بناء التقرير.");
    } else if (!pending && state?.error === false) {
      toast.success("تم عمل التقرير..");
    } else if (!pending && state?.error === true) {
      toast.error("حدث خطأ ما عند العمل فى التقرير.");
    }
  }, [pending, state]);

  function clearError(name: ReportField) {
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }

  function toggleCompany(id: number, checked: boolean) {
    setCompanyIds((prev) =>
      checked
        ? prev.includes(id)
          ? prev
          : [...prev, id]
        : prev.filter((x) => x !== id),
    );
    clearError("companyIds");
  }

  // Picked companies in the same order as the list, for labels
  const selectedCompanies = customers.filter((c) => companyIds.includes(c.id));
  const pickerText =
    selectedCompanies.length === 0
      ? "اختر الشركات"
      : selectedCompanies.length <= 2
        ? selectedCompanies.map((c) => c.name).join("، ")
        : `${selectedCompanies.length} شركات محددة`;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsed = formSchema.safeParse({
      from: dateFrom,
      to: dateTo,
      period,
      companyType,
      companyIds,
    });

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const name = issue.path[0] as ReportField;
        (nextErrors[name] ??= []).push({ message: issue.message });
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const data = parsed.data;

    const companyLabel =
      data.companyType === "0"
        ? selectedCompanies.map((c) => c.name).join("، ")
        : (COMPANY_TYPE_OPTIONS.find((o) => o.value === data.companyType)
            ?.label ?? "");
    setPrintMeta({
      periodLabel:
        PERIOD_OPTIONS.find((o) => o.value === data.period)?.label ?? "",
      companyLabel,
      from: formatDay(data.from),
      to: formatDay(data.to),
      createdAt: formatDay(new Date()),
    });

    startTransition(() => {
      submit({
        ...data,
        from: data.from.toDateString(),
        to: data.to.toDateString(),
        // Only a "specific companies" report filters by company; drop any
        // left selected before switching to foreign / all
        companyIds: data.companyType === "0" ? data.companyIds : [],
      });
    });
  }

  const showCompanys = companyType === "0";

  return (
    <>
      <form
        id="create-report"
        onSubmit={handleSubmit}
        className="print:hidden"
      >
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <Field data-invalid={!!errors.from?.length}>
                <FieldLabel className="capitalize">
                  {ar_field_name.from}
                </FieldLabel>
                <DatePicker
                  date={dateFrom}
                  setDate={(d) => {
                    setDateFrom(d);
                    clearError("from");
                    clearError("to");
                  }}
                />
                {!!errors.from?.length && <FieldError errors={errors.from} />}
              </Field>
            </div>
            <div className="col-span-1">
              <Field data-invalid={!!errors.to?.length}>
                <FieldLabel className="capitalize">
                  {ar_field_name.to}
                </FieldLabel>
                <DatePicker
                  date={dateTo}
                  setDate={(d) => {
                    setDateTo(d);
                    clearError("to");
                  }}
                />
                {!!errors.to?.length && <FieldError errors={errors.to} />}
              </Field>
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div className="col-span-1">
              <Field data-invalid={!!errors.companyType?.length}>
                <FieldLabel htmlFor="report-company-type" className="capitalize">
                  {ar_field_name.companyType}
                </FieldLabel>
                <RadioGroup
                  id="report-company-type"
                  value={companyType}
                  className="w-fit flex"
                  dir="rtl"
                  onValueChange={(value) => {
                    setCompanyType(value as CompanyType);
                    clearError("companyType");
                    clearError("companyIds");
                  }}
                  aria-invalid={!!errors.companyType?.length}
                >
                  {COMPANY_TYPE_OPTIONS.map((option) => {
                    const id = `report-company-type-${option.value}`;
                    return (
                      <Field key={option.value} orientation="horizontal">
                        <RadioGroupItem value={option.value} id={id} />
                        <FieldContent>
                          <FieldLabel htmlFor={id}>{option.label}</FieldLabel>
                          <FieldDescription>
                            {option.description}
                          </FieldDescription>
                        </FieldContent>
                      </Field>
                    );
                  })}
                </RadioGroup>
                {!!errors.companyType?.length && (
                  <FieldError errors={errors.companyType} />
                )}
              </Field>
            </div>

            <div className="col-span-1">
              <Field data-invalid={!!errors.period?.length}>
                <FieldLabel htmlFor="report-period" className="capitalize">
                  {ar_field_name.period}
                </FieldLabel>
                <RadioGroup
                  id="report-period"
                  value={period}
                  className="w-fit flex"
                  dir="rtl"
                  onValueChange={(value) => {
                    setPeriod(value as ReportPeriod);
                    clearError("period");
                  }}
                  aria-invalid={!!errors.period?.length}
                >
                  {PERIOD_OPTIONS.map((option) => {
                    const id = `report-period-${option.value}`;
                    return (
                      <Field key={option.value} orientation="horizontal">
                        <RadioGroupItem value={option.value} id={id} />
                        <FieldContent>
                          <FieldLabel htmlFor={id}>{option.label}</FieldLabel>
                          <FieldDescription>
                            {option.description}
                          </FieldDescription>
                        </FieldContent>
                      </Field>
                    );
                  })}
                </RadioGroup>
                {!!errors.period?.length && (
                  <FieldError errors={errors.period} />
                )}
              </Field>
            </div>
          </div>

          {showCompanys && (
            <div>
              <Field data-invalid={!!errors.companyIds?.length}>
                <FieldLabel className="capitalize">
                  {ar_field_name.companyIds}
                </FieldLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between font-normal"
                      disabled={customers.length === 0}
                      aria-invalid={!!errors.companyIds?.length}
                    >
                      <span className="truncate">{pickerText}</span>
                      <ChevronDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  {/* Same width as the trigger, which fills the section */}
                  <PopoverContent
                    align="start"
                    className="w-(--radix-popover-trigger-width) p-0"
                    dir="rtl"
                  >
                    <div className="flex justify-between gap-2 p-2 border-b">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCompanyIds(customers.map((c) => c.id));
                          clearError("companyIds");
                        }}
                      >
                        تحديد الكل
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCompanyIds([])}
                      >
                        مسح
                      </Button>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2 space-y-2">
                      {customers.map((c) => {
                        const id = `report-company-${c.id}`;
                        return (
                          <div key={c.id} className="flex items-center gap-2">
                            <Checkbox
                              id={id}
                              checked={companyIds.includes(c.id)}
                              onCheckedChange={(checked) =>
                                toggleCompany(c.id, checked === true)
                              }
                            />
                            <Label htmlFor={id}>{c.name}</Label>
                          </div>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>

                {!!errors.companyIds?.length && (
                  <FieldError errors={errors.companyIds} />
                )}
              </Field>
            </div>
          )}
          <div className="mb-6">
            <Button type="submit" disabled={pending}>
              {pending && <Spinner />} تطبيق التقرير
            </Button>
          </div>
        </FieldGroup>
      </form>
      {state && state.error === false && printMeta && !pending ? (
        <ReportTable records={state.response} meta={printMeta} />
      ) : (
        <></>
      )}
    </>
  );
};

export default Reportform;
