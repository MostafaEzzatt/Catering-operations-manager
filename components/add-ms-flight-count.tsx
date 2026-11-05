"use client";
import { addCount } from "@/actions/customer-flight-count";
import { customerFlightCountTable, cutomersTable } from "@/drizzle/db/schema";
import { formTextSchema } from "@/formsSchema/add-customer-flight-count";
import { canModifyRecord } from "@/lib/permissions";
import { format } from "date-fns";
import { InferSelectModel } from "drizzle-orm";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import CompanyPicker from "./company-picker";
import { Button } from "./ui/button";
import { DatePicker } from "./ui/datePicker";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import UpdateFlightCount from "./update-flight-count";

const COUNT_FIELDS = ["flightCount", "c", "h", "y"] as const;
type CountField = (typeof COUNT_FIELDS)[number];
type AddField = "customerId" | CountField | "date";
type FieldErrors = Partial<Record<AddField, { message: string }[]>>;

type FlightCountRow = InferSelectModel<typeof customerFlightCountTable>;

// The count boxes hold their text as typed, so a box can be empty; the
// schema turns the text into numbers
const EMPTY_COUNTS: Record<CountField, string> = {
  flightCount: "",
  c: "",
  h: "",
  y: "",
};

const ar_field_name: Record<AddField, string> = {
  customerId: "الشركة",
  flightCount: "عدد الرحلات",
  c: "كرو",
  h: "بزنس",
  y: "سياحى",
  date: "بتاريخ",
};

// Every add shows one toast: progress first, then the result in its place
const ADD_TOAST_ID = "add-flight-count";

// Deliberately NOT built on @tanstack/react-form: a TanStack form next to
// Radix components (this form has a Popover company picker, a Popover date
// picker and a Dialog) can trigger a synchronous render loop on React 19 that
// freezes the tab (TanStack/form#2020). Plain state plus zod safeParse, the
// same pattern as update-flight-count.tsx, avoids it.
const AddMSFlightCount = ({
  customers,
  isAdmin,
  userId,
}: {
  customers: InferSelectModel<typeof cutomersTable>[];
  isAdmin: boolean;
  userId: string | null;
}) => {
  const [isPending, startTransition] = useTransition();

  const [customerId, setCustomerId] = useState(0); // 0 = none picked
  const [counts, setCounts] = useState(EMPTY_COUNTS);
  // Not cleared after a successful add (handy when entering many companies
  // for the same day)
  const [date, setDate] = useState<Date>(() => new Date());
  const [errors, setErrors] = useState<FieldErrors>({});

  // The existing record opened for editing after a duplicate. `key` changes
  // on every open, so the dialog remounts with that record's current values.
  const [editTarget, setEditTarget] = useState<{
    record: FlightCountRow;
    key: number;
  } | null>(null);

  function clearError(name: AddField) {
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }

  // That company already has numbers for that day: offer to edit them, when
  // this user is allowed to
  function showDuplicate(existing?: FlightCountRow) {
    const canEdit =
      !!existing && canModifyRecord(existing.createdBy, { isAdmin, userId });

    toast.info("يوجد بالفعل اعداد مسجلة لتلك الشركة فى هذا التاريخ.", {
      id: ADD_TOAST_ID,
      description: canEdit
        ? "يمكنك تعديل الاعداد المسجلة."
        : existing
          ? "لا يمكنك تعديلها، تم تسجيلها بواسطة مستخدم آخر."
          : undefined,
      // Longer than the default 4s, to leave time for the button
      duration: canEdit ? 10_000 : undefined,
      action: canEdit
        ? {
            label: "تعديل",
            onClick: () =>
              setEditTarget((prev) => ({
                record: existing,
                key: (prev?.key ?? 0) + 1,
              })),
          }
        : undefined,
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending) return;

    const parsed = formTextSchema.safeParse({
      customerId,
      ...counts,
      // "YYYY-MM-DD" of the day picked, the format the server accepts
      date: format(date, "yyyy-MM-dd"),
    });

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const name = issue.path[0] as AddField;
        (nextErrors[name] ??= []).push({ message: issue.message });
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    startTransition(async () => {
      toast.loading("نعمل على اضافة اعداد الرحلات", { id: ADD_TOAST_ID });

      let result: Awaited<ReturnType<typeof addCount>>;
      try {
        // parsed.data has the counts as numbers
        result = await addCount(null, parsed.data);
      } catch {
        // Network failure or the like: report it instead of crashing the page
        result = { status: 0 };
      }

      if (result.status === 1) {
        toast.success("تم اضافة اعداد الرحلات.", { id: ADD_TOAST_ID });
        // Ready for the next company; the date stays
        setCustomerId(0);
        setCounts(EMPTY_COUNTS);
      } else if (result.status === 2) {
        showDuplicate(result.existing);
      } else if (result.status === 3) {
        toast.error("التاريخ غير صحيح، لا يمكن اضافة اعداد لتاريخ مستقبلى.", {
          id: ADD_TOAST_ID,
        });
      } else {
        toast.error("حدث خطأ ما عند اضافة اعداد الرحلات", {
          id: ADD_TOAST_ID,
        });
      }
    });
  }

  return (
    <div>
      <form id="add-ms-flights-count" onSubmit={handleSubmit}>
        <FieldGroup>
          {/* Which record: company and day side by side on wider screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field data-invalid={!!errors.customerId?.length}>
              <FieldLabel htmlFor="customerId" className="capitalize">
                {ar_field_name.customerId}
              </FieldLabel>
              <CompanyPicker
                id="customerId"
                companies={customers}
                value={customerId}
                onChange={(id) => {
                  setCustomerId(id);
                  clearError("customerId");
                }}
                invalid={!!errors.customerId?.length}
              />
              {!!errors.customerId?.length && (
                <FieldError errors={errors.customerId} />
              )}
            </Field>

            <Field data-invalid={!!errors.date?.length}>
              <FieldLabel htmlFor="date" className="capitalize">
                {ar_field_name.date}
              </FieldLabel>
              <DatePicker
                id="date"
                date={date}
                setDate={(d) => {
                  setDate(d);
                  clearError("date");
                }}
                maxDate={new Date()}
              />
              {!!errors.date?.length && <FieldError errors={errors.date} />}
            </Field>
          </div>

          {/* The counts: one row of four on wider screens, two by two on phones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COUNT_FIELDS.map((name) => {
              const isInvalid = !!errors[name]?.length;
              return (
                <Field key={name} data-invalid={isInvalid}>
                  <FieldLabel htmlFor={name} className="capitalize">
                    {ar_field_name[name]}
                  </FieldLabel>
                  <Input
                    id={name}
                    name={name}
                    value={counts[name]}
                    onChange={(e) => {
                      const text = e.target.value;
                      setCounts((prev) => ({ ...prev, [name]: text }));
                      clearError(name);
                    }}
                    aria-invalid={isInvalid}
                    // Number pad on phones; still a text box, so it can be empty
                    inputMode="numeric"
                    // An empty meal box counts as 0; flights must be filled in
                    placeholder={
                      name === "flightCount" ? ar_field_name[name] : "0"
                    }
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={errors[name]} />}
                </Field>
              );
            })}
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />} أضافة الاعداد
          </Button>
        </FieldGroup>
      </form>

      {editTarget && (
        <UpdateFlightCount
          key={editTarget.key}
          record={editTarget.record}
          companyName={
            customers.find((c) => c.id === editTarget.record.customerId)
              ?.name ?? ""
          }
          defaultOpen
          showTrigger={false}
        />
      )}
    </div>
  );
};

export default AddMSFlightCount;
