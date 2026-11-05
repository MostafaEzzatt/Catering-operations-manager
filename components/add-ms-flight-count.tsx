/* eslint-disable react/no-children-prop */
"use client";
import { addCount } from "@/actions/customer-flight-count";
import { cutomersTable } from "@/drizzle/db/schema";
import {
  formTextSchema,
  updateFormTextSchema,
} from "@/formsSchema/add-customer-flight-count";
import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { InferSelectModel } from "drizzle-orm";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { DatePicker } from "./ui/datePicker";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import CompanyPicker from "./company-picker";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

const COUNT_FIELDS = ["flightCount", "c", "h", "y"] as const;
type CountField = (typeof COUNT_FIELDS)[number];

// The count boxes hold their text as typed, so a box can be empty; the
// schema turns the text into numbers
type AddFormValues = Omit<CustomerFlightCountFormValues, CountField> &
  Record<CountField, string>;

const AddMSFlightCount = ({
  customers,
}: {
  customers: InferSelectModel<typeof cutomersTable>[];
}) => {
  const [insertState, insertSubmit, insertIsPending] = useActionState(
    addCount,
    null,
  );
  const [tansitionIsPending, startTransition] = useTransition();

  // The picked date lives here, not in the form, so it stays picked after a
  // successful add (handy when entering many companies for the same day)
  const [date, setDate] = useState<Date>(new Date());

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
      toast.info("بدء عملية اضافة اعداد الرحلات");
    } else if (!isPending && insertState == 1) {
      toast.success("تم اضافة اعداد الرحلات.");
      form.reset();
    } else if (!isPending && insertState == 2) {
      toast.info("يوجد بالفعل اعداد مسجلة لتلك الشركة فى هذا التاريخ.");
    } else if (!isPending && insertState == 3) {
      toast.error("التاريخ غير صحيح، لا يمكن اضافة اعداد لتاريخ مستقبلى.");
    } else if (!isPending && insertState === 0) {
      toast.error("حدث خطأ ما عند اضافة اعداد الرحلات");
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />} أضافة الاعداد
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default AddMSFlightCount;
