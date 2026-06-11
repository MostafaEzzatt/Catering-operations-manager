import { db } from "@/drizzle";
import { customerFlightCountTable, cutomersTable } from "@/drizzle/db/schema";
import { getSession } from "@/lib/roles";
import { desc, eq } from "drizzle-orm";
import FlightsCountDataTable from "./flights-count-table";
import HeadingTwo from "./typo-h2";

const GetAllFlightCounts = async () => {
  const { isAdmin, userId } = await getSession();
  const flightsCountData = await db
    .select()
    .from(customerFlightCountTable)
    .leftJoin(
      cutomersTable,
      eq(customerFlightCountTable.customerId, cutomersTable.id),
    )
    .orderBy(desc(customerFlightCountTable.date));

  // console.log(flightsCountData);

  return (
    <>
      <HeadingTwo txt="قائمة الشركات" />

      <FlightsCountDataTable
        records={flightsCountData}
        isAdmin={isAdmin}
        userId={userId}
      />
    </>
  );
};

export default GetAllFlightCounts;
