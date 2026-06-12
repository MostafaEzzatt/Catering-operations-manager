"use client";
import { updateCount } from "@/actions/customer-flight-count";
import { customerFlightCountTable } from "@/drizzle/db/schema";
import { updateFormSchema } from "@/formsSchema/add-customer-flight-count";
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

// Deliberately NOT built on @tanstack/react-form: one form instance per table
// row combined with Radix's composed refs triggers a synchronous render loop
// on React 19 that freezes the tab (TanStack/form#2020)
const UpdateFlightCount = ({
  record,
  companyName,
}: {
  record: InferSelectModel<typeof customerFlightCountTable>;
  companyName: string;
}) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState<Record<EditFieldName, string>>({
    flightCount: `${record.flightCount}`,
    c: `${record.c}`,
    h: `${record.h}`,
    y: `${record.y}`,
  });
  const [errors, setErrors] = useState<
    Partial<Record<EditFieldName, { message: string }[]>>
  >({});

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    // Drop abandoned edits and pick up the record's current values so a
    // reopened dialog never shows values that were cancelled or outdated
    if (nextOpen) {
      setValues({
        flightCount: `${record.flightCount}`,
        c: `${record.c}`,
        h: `${record.h}`,
        y: `${record.y}`,
      });
      setErrors({});
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsed = updateFormSchema.safeParse({
      flightCount: Number(values.flightCount),
      c: Number(values.c),
      h: Number(values.h),
      y: Number(values.y),
    });

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
      toast.info("نعمل على تحديث البيانات");
      const result = await updateCount(null, { id: record.id, ...parsed.data });

      if (result === 1) {
        toast.success("تم تحديث البيانات.");
      } else if (result === 2) {
        toast.info("لم يتم العثور على السجل لتحديثه.");
      } else if (result === 3) {
        toast.error("غير مسموح لك بتعديل هذا السجل.");
      } else {
        toast.error("حدث خطأ ما عند تحديث البيانات.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={isPending} variant={"outline"}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>تعديل اعداد الرحلات</DialogTitle>
          <DialogDescription>
            تعديل اعداد رحلات شركة {companyName} بتاريخ {record.date}.
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
                    placeholder={ar_field_name[name]}
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
