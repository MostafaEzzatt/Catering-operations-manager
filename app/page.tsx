import AddMSFlightCount from "@/components/add-ms-flight-count";
import Heading1 from "@/components/typo-h1";
import HeadingTwo from "@/components/typo-h2";

export default function Home() {
  return (
    <main className="container mx-auto">
      <Heading1 txt="اضافة اعداد الشركات" />

      <section className="border border-dashed p-4">
        <HeadingTwo txt="مصر للطيران" />

        <AddMSFlightCount />
      </section>
    </main>
  );
}
