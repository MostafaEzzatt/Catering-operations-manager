import { InferSelectModel } from "drizzle-orm";
import { customerFlightCountTable, cutomersTable } from "./drizzle/db/schema";

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
