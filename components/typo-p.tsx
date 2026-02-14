import { cn } from "@/lib/utils";

const Paragraph = ({
  txt,
  className,
}: React.ComponentProps<"button"> & { txt: string }) => {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
      {txt}
    </p>
  );
};

export default Paragraph;
