import AddMSFlightCount from "@/components/add-ms-flight-count";
import GetAllFlightCounts from "@/components/get-all-flight-counts";
import Heading1 from "@/components/typo-h1";
import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";
import { resolveDayRange } from "@/lib/date-range";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // The table's date range from ?from=&to=, the current month by default
  const { from, to } = await searchParams;
  const range = resolveDayRange(from, to);

  // Alphabetical in Arabic, the same order as the reports page
  const customers = (await db.select().from(cutomersTable)).sort((a, b) =>
    a.name.localeCompare(b.name, "ar"),
  );

  return (
    <main className="container mx-auto">
      <Heading1 txt="اضافة اعداد الشركات" />

      <div className="space-y-4">
        <section className="border border-dashed p-4">
          <AddMSFlightCount customers={customers} />
        </section>

        <section className="border border-dashed p-4">
          <GetAllFlightCounts {...range} />
        </section>
      </div>
    </main>
  );
}
