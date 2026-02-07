/* eslint-disable @typescript-eslint/no-unused-vars */
type CompanyFormValues = {
  name: string;
  code: string;
};

type formValueType<T> = Record<keyof T, string>;
