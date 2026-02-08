import { db } from "@/drizzle";
import { customerFlightCountTable, cutomersTable } from "@/drizzle/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import FlightsCountDataTable from "./flights-count-table";
import HeadingTwo from "./typo-h2";

const GetAllFlightCounts = async () => {
  const flightsCountData = await db
    .select()
    .from(customerFlightCountTable)
    .leftJoin(
      cutomersTable,
      eq(customerFlightCountTable.customerId, cutomersTable.id),
    )
    .orderBy(desc(customerFlightCountTable.createdAt));

  return (
    <>
      <HeadingTwo txt="قائمة الشركات" />

      <FlightsCountDataTable records={flightsCountData} />
    </>
  );
};

export default GetAllFlightCounts;
