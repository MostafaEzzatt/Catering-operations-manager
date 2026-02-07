/* eslint-disable @typescript-eslint/no-unused-vars */
type CompanyFormValues = {
  name: string;
  code: string;
};

type CustomerFlightCountFormValues = {
  customerId: number;
  count: number;
  date: Date;
};

type formValueType<T> = Record<keyof T, string>;
