import { db } from "@/drizzle";
import { customerFlightCountTable, cutomersTable } from "@/drizzle/db/schema";
import type { DayRange } from "@/lib/date-range";
import { getSession } from "@/lib/roles";
import { between, desc, eq } from "drizzle-orm";
import FlightCountFilter from "./flight-count-filter";
import FlightsCountDataTable from "./flights-count-table";
import HeadingTwo from "./typo-h2";

// Only the records inside the range (both ends included), so the page and its
// totals cover one period instead of every record ever entered
const GetAllFlightCounts = async ({
  from,
  to,
  isDefault,
}: DayRange & { isDefault: boolean }) => {
  const { isAdmin, userId } = await getSession();
  const flightsCountData = await db
    .select()
    .from(customerFlightCountTable)
    .leftJoin(
      cutomersTable,
      eq(customerFlightCountTable.customerId, cutomersTable.id),
    )
    .where(between(customerFlightCountTable.date, from, to))
    .orderBy(desc(customerFlightCountTable.date));

  return (
    <>
      <HeadingTwo txt="قائمة اعداد الرحلات" />

      <FlightCountFilter
        key={`${from}_${to}`}
        from={from}
        to={to}
        isDefault={isDefault}
      />

      <FlightsCountDataTable
        records={flightsCountData}
        isAdmin={isAdmin}
        userId={userId}
      />
    </>
  );
};

export default GetAllFlightCounts;
