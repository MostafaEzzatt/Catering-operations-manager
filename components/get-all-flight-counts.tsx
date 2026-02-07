import { db } from "@/drizzle";
import { customerFlightCountTable } from "@/drizzle/db/schema";
import FlightsCountDataTable from "./flights-count-table";
import HeadingTwo from "./typo-h2";

const GetAllFlightCounts = async () => {
  const flightsCount = await db.select().from(customerFlightCountTable);
  return (
    <>
      <HeadingTwo txt="قائمة الشركات" />

      <FlightsCountDataTable records={flightsCount} />
    </>
  );
};

export default GetAllFlightCounts;
