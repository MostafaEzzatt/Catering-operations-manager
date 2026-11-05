"use client";
import { updateCount } from "@/actions/customer-flight-count";
import { customerFlightCountTable } from "@/drizzle/db/schema";
import { updateFormTextSchema } from "@/formsSchema/add-customer-flight-count";
import { formatDayString } from "@/lib/date-range";
import { InferSelectModel } from "drizzle-orm";
import { Pencil } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

type EditFieldName = keyof UpdateFlightCountFormValues;

const FIELD_NAMES: EditFieldName[] = ["flightCount", "c", "h", "y"];

const ar_field_name: formValueType<UpdateFlightCountFormValues> = {
  flightCount: "عدد الرحلات",
  c: "كرو",
  h: "بزنس",
  y: "سياحى",
};

function recordValues(
  record: InferSelectModel<typeof customerFlightCountTable>,
): Record<EditFieldName, string> {
  return {
    flightCount: `${record.flightCount}`,
    c: `${record.c}`,
    h: `${record.h}`,
    y: `${record.y}`,
  };
}

// Deliberately NOT built on @tanstack/react-form: one form instance per table
// row combined with Radix's composed refs triggers a synchronous render loop
// on React 19 that freezes the tab (TanStack/form#2020)
const UpdateFlightCount = ({
  record,
  companyName,
  defaultOpen = false,
  showTrigger = true,
}: {
  record: InferSelectModel<typeof customerFlightCountTable>;
  companyName: string;
  // For opening it from elsewhere (the add form, on a duplicate): mount it
  // with a new key, defaultOpen and no trigger button
  defaultOpen?: boolean;
  showTrigger?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState<Record<EditFieldName, string>>(() =>
    recordValues(record),
  );
  const [errors, setErrors] = useState<
    Partial<Record<EditFieldName, { message: string }[]>>
  >({});

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    // Drop abandoned edits and pick up the record's current values so a
    // reopened dialog never shows values that were cancelled or outdated
    if (nextOpen) {
      setValues(recordValues(record));
      setErrors({});
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // The schema turns the boxes' text into numbers (an empty meal box is 0)
    const parsed = updateFormTextSchema.safeParse(values);

    if (!parsed.success) {
      const nextErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const name = issue.path[0] as EditFieldName;
        (nextErrors[name] ??= []).push({ message: issue.message });
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    // Close before the action runs (same as the delete AlertDialog):
    // closing while the revalidate re-render is in flight leaves Radix's
    // pointer-events: none stuck on <body>, freezing the page
    setOpen(false);
    startTransition(async () => {
      // One toast: it shows progress, then turns into the result
      const toastId = toast.loading("نعمل على تحديث البيانات");
      const result = await updateCount(null, { id: record.id, ...parsed.data });

      if (result === 1) {
        toast.success("تم تحديث البيانات.", { id: toastId });
      } else if (result === 2) {
        toast.info("لم يتم العثور على السجل لتحديثه.", { id: toastId });
      } else if (result === 3) {
        toast.error("غير مسموح لك بتعديل هذا السجل.", { id: toastId });
      } else {
        toast.error("حدث خطأ ما عند تحديث البيانات.", { id: toastId });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button disabled={isPending} variant={"outline"}>
            <Pencil />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>تعديل اعداد الرحلات</DialogTitle>
          <DialogDescription>
            تعديل اعداد رحلات شركة {companyName} بتاريخ{" "}
            <bdi dir="ltr">{formatDayString(record.date)}</bdi>.
          </DialogDescription>
        </DialogHeader>
        <form id={`update-flight-count-${record.id}`} onSubmit={handleSubmit}>
          <FieldGroup>
            {FIELD_NAMES.map((name) => {
              const isInvalid = !!errors[name]?.length;
              const inputId = `update-${name}-${record.id}`;
              return (
                <Field key={name} data-invalid={isInvalid}>
                  <FieldLabel htmlFor={inputId} className="capitalize">
                    {ar_field_name[name]}
                  </FieldLabel>
                  <Input
                    id={inputId}
                    name={name}
                    value={values[name]}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [name]: e.target.value }))
                    }
                    aria-invalid={isInvalid}
                    // Number pad on phones; still a text box, so it can be empty
                    inputMode="numeric"
                    // An empty meal box counts as 0; flights must be filled in
                    placeholder={name === "flightCount" ? ar_field_name[name] : "0"}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={errors[name]} />}
                </Field>
              );
            })}

            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner />} تحديث الاعداد
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFlightCount;
