/* eslint-disable react/no-children-prop */
"use client";
import { addCount } from "@/actions/customer-flight-count";
import { customerFlightCountTable, cutomersTable } from "@/drizzle/db/schema";
import {
  formTextSchema,
  updateFormTextSchema,
} from "@/formsSchema/add-customer-flight-count";
import { canModifyRecord } from "@/lib/permissions";
import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { InferSelectModel } from "drizzle-orm";
import { useActionState, useEffect, useState, useTransition } from "react";
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

// The count boxes hold their text as typed, so a box can be empty; the
// schema turns the text into numbers
type AddFormValues = Omit<CustomerFlightCountFormValues, CountField> &
  Record<CountField, string>;

type FlightCountRow = InferSelectModel<typeof customerFlightCountTable>;

// Every add shows one toast: progress first, then the result in its place
const ADD_TOAST_ID = "add-flight-count";

const AddMSFlightCount = ({
  customers,
  isAdmin,
  userId,
}: {
  customers: InferSelectModel<typeof cutomersTable>[];
  isAdmin: boolean;
  userId: string | null;
}) => {
  const [insertState, insertSubmit, insertIsPending] = useActionState(
    addCount,
    null,
  );
  const [tansitionIsPending, startTransition] = useTransition();

  // The picked date lives here, not in the form, so it stays picked after a
  // successful add (handy when entering many companies for the same day)
  const [date, setDate] = useState<Date>(new Date());

  // The existing record opened for editing after a duplicate. `key` changes
  // on every open, so the dialog remounts with that record's current values.
  const [editTarget, setEditTarget] = useState<{
    record: FlightCountRow;
    key: number;
  } | null>(null);

  const isPending = insertIsPending || tansitionIsPending;

  const defaultValues: AddFormValues = {
    customerId: 0,
    flightCount: "",
    c: "",
    h: "",
    y: "",
    date: format(new Date(), "yyyy-MM-dd"),
  };

  const ar_field_name: formValueType<CustomerFlightCountFormValues> = {
    customerId: "الشركة",
    flightCount: "عدد الرحلات",
    c: "كرو",
    h: "بزنس",
    y: "سياحى",
    date: "بتاريخ",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formTextSchema,
    },
    onSubmit: ({ value }) => {
      // Runs only after validation passed, so the counts parse as numbers
      const counts = updateFormTextSchema.parse(value);
      startTransition(() => {
        insertSubmit({
          ...value,
          ...counts,
          // "YYYY-MM-DD" of the day picked, the format the server accepts
          date: format(date, "yyyy-MM-dd"),
        });
      });
    },
  });

  useEffect(() => {
    if (isPending) {
      toast.loading("نعمل على اضافة اعداد الرحلات", { id: ADD_TOAST_ID });
    } else if (insertState?.status === 1) {
      toast.success("تم اضافة اعداد الرحلات.", { id: ADD_TOAST_ID });
      form.reset();
    } else if (insertState?.status === 2) {
      const existing = insertState.existing;
      const canEdit =
        !!existing &&
        canModifyRecord(existing.createdBy, { isAdmin, userId });

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
    } else if (insertState?.status === 3) {
      toast.error("التاريخ غير صحيح، لا يمكن اضافة اعداد لتاريخ مستقبلى.", {
        id: ADD_TOAST_ID,
      });
    } else if (insertState?.status === 0) {
      toast.error("حدث خطأ ما عند اضافة اعداد الرحلات", { id: ADD_TOAST_ID });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, insertState]);

  return (
    <div>
      <form
        id="add-ms-flights-count"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          {/* Which record: company and day side by side on wider screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="customerId"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="capitalize">
                      {ar_field_name[field.name]}
                    </FieldLabel>

                    <CompanyPicker
                      id={field.name}
                      companies={customers}
                      value={field.state.value}
                      onChange={(companyId) => field.handleChange(companyId)}
                      invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="date"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="capitalize">
                      {ar_field_name[field.name]}
                    </FieldLabel>

                    <DatePicker
                      id={field.name}
                      date={date}
                      setDate={setDate}
                      maxDate={new Date()}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </div>

          {/* The counts: one row of four on wider screens, two by two on phones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COUNT_FIELDS.map((name) => (
              <form.Field
                key={name}
                name={name}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name} className="capitalize">
                        {ar_field_name[name]}
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        // Number pad on phones; still a text box, so it can be empty
                        inputMode="numeric"
                        // An empty meal box counts as 0; flights must be filled in
                        placeholder={
                          name === "flightCount" ? ar_field_name[name] : "0"
                        }
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            ))}
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
