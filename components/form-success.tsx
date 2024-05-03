import { CheckCircledIcon } from "@radix-ui/react-icons";

interface FormSuccessProps {
  messege?: string;
}

export const FormSuccess = ({ messege }: FormSuccessProps) => {
  if (!messege) return null;

  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <CheckCircledIcon className="h-4 w-4 " />
      <p>{messege}</p>
    </div>
  );
};
