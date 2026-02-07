/* eslint-disable react/no-children-prop */
"use client";
import { addCustomer } from "@/actions/customer";
import { formSchema } from "@/formsSchema/add-company";
import { useForm } from "@tanstack/react-form";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

const AddCompany = () => {
  const [insertState, insertSubmit, insertIsPending] = useActionState(
    addCustomer,
    null,
  );
  const [tansitionIsPending, startTransition] = useTransition();

  const defaultValues: CompanyFormValues = {
    name: "",
    code: "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(() => {
        insertSubmit(value);
      });
    },
  });

  const ar_field_name: formValueType<CompanyFormValues> = {
    name: "اسم الشركة",
    code: "كود الشركة",
  };

  const isPending = insertIsPending || tansitionIsPending;

  useEffect(() => {
    if (isPending) {
      toast.info("بدء عملية اضافة الشركة");
    } else if (!isPending && insertState) {
      toast.success("تم اضافة الشركة.");
    } else if (!isPending && insertState === false) {
      toast.error("حدث خطأ ما عند اضافة الشركة");
    }
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

          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />} أضافة الشركة
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default AddCompany;
