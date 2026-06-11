import AddCompany from "@/components/add-company";
import GetAllCompanys from "@/components/get_all_companys";
import NotAllowed from "@/components/not-allowed";
import Heading1 from "@/components/typo-h1";
import { getSession } from "@/lib/roles";

export const dynamic = "force-dynamic";

const page = async () => {
  const { isAdmin } = await getSession();
  if (!isAdmin) return <NotAllowed />;

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
