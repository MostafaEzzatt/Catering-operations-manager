import AddMSFlightCount from "@/components/add-ms-flight-count";
import FlightCountFilter from "@/components/flight-count-filter";
import GetAllFlightCounts from "@/components/get-all-flight-counts";
import SignInRequired from "@/components/sign-in-required";
import Heading1 from "@/components/typo-h1";
import HeadingTwo from "@/components/typo-h2";
import { Spinner } from "@/components/ui/spinner";
import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";
import { resolveDayRange } from "@/lib/date-range";
import { getSession } from "@/lib/roles";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

// Shown in the table's place while its query runs (first load only: a later
// filter change keeps the old table up until the new one is ready)
function TableLoading() {
  return (
    <div className="flex h-24 items-center justify-center gap-2 rounded-md border text-muted-foreground">
      <Spinner /> جارى تحميل البيانات...
    </div>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // The table's date range from ?from=&to=, the current month by default
  const { from, to } = await searchParams;
  const range = resolveDayRange(from, to);

  // Checked before any query: the layout hiding the page does not stop its
  // data from being sent (proxy.ts normally redirects before this runs)
  const { isAuthenticated, isAdmin, userId } = await getSession();
  if (!isAuthenticated) return <SignInRequired />;

  // Alphabetical in Arabic, the same order as the reports page
  const customers = (await db.select().from(cutomersTable)).sort((a, b) =>
    a.name.localeCompare(b.name, "ar"),
  );

  return (
    <main className="container mx-auto">
      <Heading1 txt="اضافة اعداد الشركات" />

      <div className="space-y-4">
        <section className="border border-dashed p-4">
          <AddMSFlightCount
            customers={customers}
            isAdmin={isAdmin}
            userId={userId}
          />
        </section>

        <section className="border border-dashed p-4">
          <HeadingTwo txt="قائمة اعداد الرحلات" />

          {/* key: back/forward resets the pickers to the URL's dates */}
          <FlightCountFilter
            key={`${range.from}_${range.to}`}
            from={range.from}
            to={range.to}
            isDefault={range.isDefault}
          />

          {/* The form and filter show right away; the table streams in */}
          <Suspense fallback={<TableLoading />}>
            <GetAllFlightCounts from={range.from} to={range.to} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
