const HeadingTwo = ({ txt }: { txt: string }) => {
  return (
    <h2 className="scroll-m-20 border-b pb-6 mb-6 text-3xl font-semibold tracking-tight first:mt-0 ">
      {txt}
    </h2>
  );
};

export default HeadingTwo;
