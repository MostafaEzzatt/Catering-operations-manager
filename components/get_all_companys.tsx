import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";
import CompanyTable from "./company-table";
import InlineNote from "./inline-note";
import HeadingTwo from "./typo-h2";

const GetAllCompanys = async () => {
  const companys = await db.select().from(cutomersTable);

  return (
    <>
      <HeadingTwo txt="قائمة الشركات" />

      {companys.length <= 0 ? (
        <InlineNote txt="لم يتم اضافة شركات بعد." />
      ) : (
        <CompanyTable customers={companys} />
      )}
    </>
  );
};

export default GetAllCompanys;
