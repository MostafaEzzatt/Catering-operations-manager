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
  date: string;
};

type formValueType<T> = Record<keyof T, string>;

interface reportForm {
  from: string;
  to: string;
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

interface logFlightDetails {
  objType: "Flight";
  id: number;
  date: string;
  customerId: number;
  flightCount: number;
  c: string;
  h: string;
  y: string;
  createdAt: string;
  updatedAt: string;
}

interface logCompanyDetails {
  objType: "Company";
  id: number;
  code: string;
  name: string;
  cNumber: string;
  createdAt: string;
  updatedAt: string;
}

type logTableMetaDataType = logFlightDetails | logCompanyDetails;

type selectCompanyByIdType = CompanyFormValues & { id: number };
