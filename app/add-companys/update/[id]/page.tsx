import UpdateCompany from "@/components/update-company";
import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";

async function Update({ params }: { params: Promise<{ id: string }> }) {
  //  Display Company Id in the URL
  const { id } = await params;

  if (!id) {
    return <div>Company ID is missing.</div>;
  }

  const getCompanyById = await db
    .select()
    .from(cutomersTable)
    .where(eq(cutomersTable.id, parseInt(id)))
    .limit(1);

  if (getCompanyById.length === 0) {
    return <div>Company not found.</div>;
  }
  return (
    <div className="container mx-auto">
      <UpdateCompany companyData={getCompanyById[0]} />
    </div>
  );
}

export default Update;
