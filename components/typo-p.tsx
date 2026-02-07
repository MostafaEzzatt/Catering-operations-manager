const Paragraph = ({ txt }: { txt: string }) => {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{txt}</p>;
};

export default Paragraph;
