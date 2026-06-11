import NotAllowed from "@/components/not-allowed";
import UpdateCompany from "@/components/update-company";
import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";
import { getSession } from "@/lib/roles";
import { eq } from "drizzle-orm";

async function Update({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated } = await getSession();
  if (!isAuthenticated) return <NotAllowed />;

  //  Display Company Id in the URL
  const { id } = await params;

  const companyId = parseInt(id);
  if (Number.isNaN(companyId)) {
    return <div>Company not found.</div>;
  }

  const getCompanyById = await db
    .select()
    .from(cutomersTable)
    .where(eq(cutomersTable.id, companyId))
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
