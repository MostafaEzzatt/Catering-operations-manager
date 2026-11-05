import Link from "next/link";

// /add-companys/update without a company id: point back to the list, where
// each company has its own edit button
function UpdateComp() {
  return (
    <main className="container mx-auto text-center font-bold text-3xl space-y-4">
      <p>اختر الشركة التى تريد تعديلها من صفحة الشركات.</p>
      <Link href="/add-companys" className="text-orange-400 underline text-xl">
        الذهاب الى صفحة الشركات
      </Link>
    </main>
  );
}

export default UpdateComp;
