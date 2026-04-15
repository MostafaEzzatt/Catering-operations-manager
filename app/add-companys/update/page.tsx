import Link from "next/link";

function UpdateComp() {
  return (
    <div className="container mx-auto text-7xl font-black">
      برجاء الرجوع الى صفحة الشركات{" "}
      <Link href="/add-companys" className="text-blue-500">
        {" "}
        هنا{" "}
      </Link>
    </div>
  );
}

export default UpdateComp;
