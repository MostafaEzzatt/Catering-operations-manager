import AddCompany from "@/components/add-company";
import GetAllCompanys from "@/components/get_all_companys";
import SignInRequired from "@/components/sign-in-required";
import Heading1 from "@/components/typo-h1";
import { getSession } from "@/lib/roles";

export const dynamic = "force-dynamic";

const page = async () => {
  // Checked before any query: the layout hiding the page does not stop its
  // data from being sent (proxy.ts normally redirects before this runs)
  const { isAuthenticated } = await getSession();
  if (!isAuthenticated) return <SignInRequired />;

  return (
    <main className="container mx-auto">
      <Heading1 txt="اضافة الشركات" />

      <div className="space-y-4">
        <section className="border border-dashed p-4">
          <AddCompany />
        </section>

        <section className="border border-dashed p-4">
          <GetAllCompanys />
        </section>
      </div>
    </main>
  );
};

export default page;
