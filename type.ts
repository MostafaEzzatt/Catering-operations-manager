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

type UpdateFlightCountFormValues = {
  flightCount: number;
  c: number;
  h: number;
  y: number;
};

type formValueType<T> = Record<keyof T, string>;

interface reportForm {
  from: string;
  to: string;
  period: "day" | "month" | "year";
  companyType: string;
  companyIds: number[];
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

// What audit_logs.metadata holds: the affected row as JSON, so timestamps are
// ISO strings. Columns added by later migrations are optional because older
// log rows were written before those columns existed.
interface storedFlightDetails {
  id: number;
  date: string;
  customerId: number;
  flightCount: number;
  c: number;
  h: number;
  y: number;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface storedCompanyDetails {
  id: number;
  code: string;
  name: string;
  cNumber: string;
  deleteRequestedBy?: string | null;
  deleteRequestedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

type logStoredMetadata = storedFlightDetails | storedCompanyDetails;

// The logs page tags each entry with objType when it displays it; objType is
// not stored in the database
interface logFlightDetails extends storedFlightDetails {
  objType: "Flight";
}

interface logCompanyDetails extends storedCompanyDetails {
  objType: "Company";
}

type logTableMetaDataType = logFlightDetails | logCompanyDetails;

type selectCompanyByIdType = CompanyFormValues & { id: number };
