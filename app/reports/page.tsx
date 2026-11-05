import Reportform from "@/components/report-form";
import Heading1 from "@/components/typo-h1";
import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";

const Reports = async () => {
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
