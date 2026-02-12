import Reportform from "@/components/report-form";
import Heading1 from "@/components/typo-h1";
import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";

const Reports = async () => {
  const customers = await db.select().from(cutomersTable);
  return (
    <main className="container mx-auto">
      <Heading1 txt="عمل تقارير" />
      <section className="border border-dashed p-4 print:border-0">
        <Reportform customers={customers} />
      </section>
    </main>
  );
};

export default Reports;
