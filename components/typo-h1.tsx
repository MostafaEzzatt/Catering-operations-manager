import { cn } from "@/lib/utils";

const Heading1 = ({
  txt,
  className,
}: React.ComponentProps<"h1"> & { txt: string }) => {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mb-8 print:hidden",
        className,
      )}
    >
      {txt}
    </h1>
  );
};

export default Heading1;
