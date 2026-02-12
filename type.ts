/* eslint-disable @typescript-eslint/no-unused-vars */
type CompanyFormValues = {
  name: string;
  code: string;
  cNumber: string;
};

type CustomerFlightCountFormValues = {
  customerId: number;
  flightCount: number;
  c: number;
  h: number;
  y: number;
  date: Date;
};

type formValueType<T> = Record<keyof T, string>;

interface reportForm {
  from: Date;
  to: Date;
  monthFormat: boolean;
  companyType: string;
  companyId: number;
  allComp: Array<CompanyFormValues & { id: number }>;
}

interface reportResponseType {
  date: string;
  customer: string;
  flightCount: number;
  c: number;
  h: number;
  y: number;
}
interface reportType {
  error: boolean;
  response: Array<reportResponseType>;
}
