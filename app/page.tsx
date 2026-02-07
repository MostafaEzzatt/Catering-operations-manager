import AddMSFlightCount from "@/components/add-ms-flight-count";
import GetAllFlightCounts from "@/components/get-all-flight-counts";
import Heading1 from "@/components/typo-h1";
import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";

export default async function Home() {
  const customers = await db.select().from(cutomersTable);
  return (
    <main className="container mx-auto">
      <Heading1 txt="اضافة اعداد الشركات" />

      <div className="space-y-4">
        <section className="border border-dashed p-4">
          <AddMSFlightCount customers={customers} />
        </section>

        <section className="border border-dashed p-4">
          <GetAllFlightCounts />
        </section>
      </div>
    </main>
  );
}
