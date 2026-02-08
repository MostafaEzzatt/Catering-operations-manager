/* eslint-disable react/no-children-prop */
"use client";
import { addCount } from "@/actions/customer-flight-count";
import { cutomersTable } from "@/drizzle/db/schema";
import { formSchema } from "@/formsSchema/add-customer-flight-count";
import { useForm } from "@tanstack/react-form";
import { InferSelectModel } from "drizzle-orm";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { DatePicker } from "./ui/datePicker";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Spinner } from "./ui/spinner";

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

  const [date, setDate] = useState<Date>(new Date());

  const isPending = insertIsPending || tansitionIsPending;

  const defaultValues: CustomerFlightCountFormValues = {
    customerId: 0,
    flightCount: 0,
    c: 0,
    h: 0,
    y: 0,
    date: new Date(),
  };

  const ar_field_name: formValueType<CustomerFlightCountFormValues> = {
    customerId: "الشركة",
    flightCount: "العدد",
    c: "كرو",
    h: "بزنس",
    y: "سياحى",
    date: "بتاريخ",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(() => {
        insertSubmit({ ...value, date: date });
      });
    },
  });

  useEffect(() => {
    if (isPending) {
      toast.info("بدء عملية اضافة الشركة");
    } else if (!isPending && insertState) {
      toast.success("تم اضافة الشركة.");
      form.reset();
    } else if (!isPending && insertState === false) {
      toast.error("حدث خطأ ما عند اضافة الشركة");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, insertState]);

  return (
    <div>
      <form
        id="add-company"
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

                  {customers.length >= 1 ? (
                    <Select
                      dir="rtl"
                      value={`${field.state.value}`}
                      onValueChange={(value) => {
                        field.handleChange(Number(value));
                      }}
                    >
                      <SelectTrigger className="w-45">
                        <SelectValue placeholder="اسم الشركة" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={`${c.id}`}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select dir="rtl" disabled>
                      <SelectTrigger className="w-45">
                        <SelectValue placeholder="اسم الشركة" />
                      </SelectTrigger>
                      <SelectContent></SelectContent>
                    </Select>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="flightCount"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} className="capitalize">
                    {ar_field_name[field.name]}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    aria-invalid={isInvalid}
                    placeholder={ar_field_name[field.name]}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="c"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} className="capitalize">
                    {ar_field_name[field.name]}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    aria-invalid={isInvalid}
                    placeholder={ar_field_name[field.name]}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="h"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} className="capitalize">
                    {ar_field_name[field.name]}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    aria-invalid={isInvalid}
                    placeholder={ar_field_name[field.name]}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="y"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} className="capitalize">
                    {ar_field_name[field.name]}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    aria-invalid={isInvalid}
                    placeholder={ar_field_name[field.name]}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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

                  <DatePicker date={date} setDate={setDate} />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />} أضافة الشركة
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default AddMSFlightCount;
