/* eslint-disable react/no-children-prop */

"use client";
import { reportAction } from "@/actions/report";
import { Checkbox } from "@/components/ui/checkbox";
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
import { formSchema } from "@/formsSchema/report-flights";
import { useForm } from "@tanstack/react-form";
import { InferSelectModel } from "drizzle-orm";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import ReportTable from "./report-table";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const Reportform = ({
  customers,
}: {
  customers: InferSelectModel<typeof cutomersTable>[];
}) => {
  const [transitionPending, startTransition] = useTransition();
  const [state, submit, submitIsPending] = useActionState(reportAction, null);
  const pending = transitionPending || submitIsPending;

  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [showCompanys, setShowCompanys] = useState(true);

  const defaultValues = {
    from: new Date(),
    to: new Date(),
    monthFormat: false,
    companyType: "0",
    companyId: 0,
    allComp: customers,
  };
  const ar_field_name = {
    from: "من",
    to: "الى",
    monthFormat: "شهرى",
    companyType: "تحديد الشركة",
    companyId: "نحديد الشركة",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      console.log({
        ...value,
        from: dateFrom.toDateString(),
        to: dateTo.toDateString(),
      });
      startTransition(() => {
        submit({
          ...value,
          from: dateFrom.toDateString(),
          to: dateTo.toDateString(),
        });
      });
    },
  });

  useEffect(() => {
    if (pending) {
      toast.info("بدء عملية بناء التقرير.");
    } else if (!pending && state?.error === false) {
      toast.success("تم عمل التقرير..");
    } else if (!pending && state?.error === true) {
      toast.error("حدث خطأ ما عند العمل فى التقرير.");
    }
  }, [pending, state]);

  return (
    <>
      <form
        id="create-report"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="print:hidden"
      >
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <form.Field
                name="from"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name} className="capitalize">
                        {ar_field_name[field.name]}
                      </FieldLabel>

                      <DatePicker date={dateFrom} setDate={setDateFrom} />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
            <div className="col-span-1">
              <form.Field
                name="to"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name} className="capitalize">
                        {ar_field_name[field.name]}
                      </FieldLabel>

                      <DatePicker date={dateTo} setDate={setDateTo} />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 grid-cols-1">
            <div className="md:col-span-2 col-span-1">
              <form.Field
                name="companyType"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name} className="capitalize">
                        {ar_field_name[field.name]}
                      </FieldLabel>

                      <RadioGroup
                        defaultValue="0"
                        className="w-fit flex"
                        dir="rtl"
                        id={field.name}
                        onBlur={field.handleBlur}
                        onValueChange={(e) => {
                          field.handleChange(e);
                          setShowCompanys(e === "0" ? true : false);
                        }}
                        aria-invalid={isInvalid}
                      >
                        <Field orientation="horizontal">
                          <RadioGroupItem value="0" id="desc-r1" />
                          <FieldContent>
                            <FieldLabel htmlFor="desc-r1">حدد شركة</FieldLabel>
                            <FieldDescription>
                              حدد شركة للتقرير.
                            </FieldDescription>
                          </FieldContent>
                        </Field>

                        <Field orientation="horizontal">
                          <RadioGroupItem value="1" id="desc-r2" />
                          <FieldContent>
                            <FieldLabel htmlFor="desc-r2">
                              الشركات الاجنبية
                            </FieldLabel>
                            <FieldDescription>
                              الشركات الاجنبية فقط.
                            </FieldDescription>
                          </FieldContent>
                        </Field>

                        <Field orientation="horizontal">
                          <RadioGroupItem value="2" id="desc-r3" />
                          <FieldContent>
                            <FieldLabel htmlFor="desc-r3">
                              جميع الشركات
                            </FieldLabel>
                            <FieldDescription>
                              تحديد كل الشركات.
                            </FieldDescription>
                          </FieldContent>
                        </Field>
                      </RadioGroup>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>

            <div className="col-span-1">
              <form.Field
                name="monthFormat"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} className="md:mt-0 mt-4">
                      <FieldGroup className="mx-auto w-72">
                        <Field orientation="horizontal">
                          <Checkbox
                            id="terms-checkbox-desc"
                            name="terms-checkbox-desc"
                            checked={field.state.value as boolean}
                            onCheckedChange={(checked) => {
                              field.handleChange(checked as boolean);
                            }}
                          />
                          <FieldContent>
                            <FieldLabel htmlFor="terms-checkbox-desc">
                              تقرير شهرى
                            </FieldLabel>
                            <FieldDescription>
                              فى حالة تحديد هذا الخيار سيكون التحديد شهرى لكل
                              شركة على حدى.
                            </FieldDescription>
                          </FieldContent>
                        </Field>
                      </FieldGroup>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
          </div>

          {showCompanys && (
            <div>
              <form.Field
                name="companyId"
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
          )}
          <div className="mb-6">
            <Button type="submit">تطبيق التقرير</Button>
          </div>
        </FieldGroup>
      </form>
      {state && state.error === false ? (
        <ReportTable records={state.response} />
      ) : (
        <></>
      )}
    </>
  );
};

export default Reportform;
