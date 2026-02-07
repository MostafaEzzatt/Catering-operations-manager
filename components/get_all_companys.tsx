import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";
import CompanyTable from "./company-table";
import HeadingTwo from "./typo-h2";

const GetAllCompanys = async () => {
  const companys = await db.select().from(cutomersTable);

  return (
    <>
      <HeadingTwo txt="قائمة الشركات" />

      <CompanyTable customers={companys} />
    </>
  );
};

export default GetAllCompanys;
