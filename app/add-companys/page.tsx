import AddCompany from "@/components/add-company";
import GetAllCompanys from "@/components/get_all_companys";
import Heading1 from "@/components/typo-h1";

const page = () => {
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
