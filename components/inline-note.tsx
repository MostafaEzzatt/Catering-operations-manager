import { Lead } from "./typo-lead";

const InlineNote = ({ txt }: { txt: string }) => {
  return (
    <div className="text-center">
      <Lead txt={txt} />
    </div>
  );
};

export default InlineNote;
