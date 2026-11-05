import Reportform from "@/components/report-form";
import SignInRequired from "@/components/sign-in-required";
import Heading1 from "@/components/typo-h1";
import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";
import { getSession } from "@/lib/roles";

const Reports = async () => {
  // Checked before any query: the layout hiding the page does not stop its
  // data from being sent (proxy.ts normally redirects before this runs)
  const { isAuthenticated } = await getSession();
  if (!isAuthenticated) return <SignInRequired />;

  // Alphabetical with Arabic collation, so the company picker is easy to scan
  const customers = (await db.select().from(cutomersTable)).sort((a, b) =>
    a.name.localeCompare(b.name, "ar"),
  );
  return (
    <main className="container mx-auto">
      <Heading1 txt="عمل تقارير" />
      <section className="border border-dashed p-4 print:border-0 print:p-0">
        <Reportform customers={customers} />
      </section>
    </main>
  );
};

export default Reports;
