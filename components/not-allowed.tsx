import Link from "next/link";

const NotAllowed = () => {
  return (
    <main className="container mx-auto text-center font-bold text-3xl space-y-4">
      <p>هذه الصفحة متاحة للمشرفين فقط.</p>
      <Link href="/" className="text-orange-400 underline text-xl">
        العودة الى الصفحة الرئيسية
      </Link>
    </main>
  );
};

export default NotAllowed;
