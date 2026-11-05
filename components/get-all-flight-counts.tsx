import { db } from "@/drizzle";
import { customerFlightCountTable, cutomersTable } from "@/drizzle/db/schema";
import type { DayRange } from "@/lib/date-range";
import { getSession } from "@/lib/roles";
import { between, eq } from "drizzle-orm";
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
    .where(between(customerFlightCountTable.date, from, to));

  // Newest day first, then companies in Arabic alphabetical order within a
  // day. Sorted here, not in SQL, so names sort like everywhere else in the
  // app (the database's collation may order Arabic differently).
  flightsCountData.sort((a, b) => {
    const dayA = a["co-mgr-customer-flight-count"].date;
    const dayB = b["co-mgr-customer-flight-count"].date;
    if (dayA !== dayB) return dayA < dayB ? 1 : -1;
    return (a["co-mgr-customers"]?.name ?? "").localeCompare(
      b["co-mgr-customers"]?.name ?? "",
      "ar",
    );
  });

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
