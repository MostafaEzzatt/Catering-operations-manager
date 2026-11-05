import SignInRequired from "@/components/sign-in-required";
import UpdateCompany from "@/components/update-company";
import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";
import { getSession } from "@/lib/roles";
import { eq } from "drizzle-orm";
import Link from "next/link";

function CompanyNotFound() {
  return (
    <main className="container mx-auto text-center font-bold text-3xl space-y-4">
      <p>الشركة غير موجودة.</p>
      <Link href="/add-companys" className="text-orange-400 underline text-xl">
        العودة الى صفحة الشركات
      </Link>
    </main>
  );
}

async function Update({ params }: { params: Promise<{ id: string }> }) {
  // Any signed-in user may edit a company (updateCustomer checks the same).
  // Checked before any query: the layout hiding the page does not stop its
  // data from being sent (proxy.ts normally redirects before this runs)
  const { isAuthenticated } = await getSession();
  if (!isAuthenticated) return <SignInRequired />;

  //  Display Company Id in the URL
  const { id } = await params;

  const companyId = parseInt(id);
  if (Number.isNaN(companyId)) return <CompanyNotFound />;

  const getCompanyById = await db
    .select()
    .from(cutomersTable)
    .where(eq(cutomersTable.id, companyId))
    .limit(1);

  if (getCompanyById.length === 0) return <CompanyNotFound />;

  return (
    <div className="container mx-auto">
      <UpdateCompany companyData={getCompanyById[0]} />
    </div>
  );
}

export default Update;
