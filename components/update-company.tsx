/* eslint-disable react/no-children-prop */
"use client";
import { addCustomer, updateCustomer } from "@/actions/customer";
import { formSchema } from "@/formsSchema/add-company";
import { useForm } from "@tanstack/react-form";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

const UpdateCompany = ({
  companyData,
}: {
  companyData: selectCompanyByIdType;
}) => {
  const [updateState, updateSubmit, updateIsPending] = useActionState(
    updateCustomer,
    null,
  );
  const [tansitionIsPending, startTransition] = useTransition();

  const defaultValues: CompanyFormValues = {
    name: companyData.name,
    code: companyData.code,
    cNumber: companyData.cNumber,
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(() => {
        updateSubmit({ id: companyData.id, ...value });
      });
    },
  });

  const ar_field_name: formValueType<CompanyFormValues> = {
    name: "اسم الشركة",
    code: "كود الشركة",
    cNumber: "رقم الشركة",
  };

  const isPending = updateIsPending || tansitionIsPending;

  useEffect(() => {
    if (isPending) {
      toast.info("بدء عملية تحديث الشركة");
    } else if (!isPending && updateState == 1) {
      toast.success("تم تحديث الشركة.");
      redirect("/add-companys");
    } else if (!isPending && updateState == 2) {
      toast.info("لم يتم العثور على الشركة لتحديثها.");
    } else if (!isPending && updateState === 0) {
      toast.error("حدث خطأ ما عند تحديث الشركة");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, updateState]);

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
            name="name"
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
                    onChange={(e) => field.handleChange(e.target.value)}
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
            name="code"
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
                    onChange={(e) => field.handleChange(e.target.value)}
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
            name="cNumber"
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
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder={ar_field_name[field.name]}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />} تحديث الشركة
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default UpdateCompany;
