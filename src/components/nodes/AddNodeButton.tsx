import { Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AddNodeButtonProps {
  data: {
    onClick?: () => void;
  };
}

export function AddNodeButton({ data }: Readonly<AddNodeButtonProps>) {
  return (
    <div className="w-full h-full">
      <Handle
        type="target"
        position={Position.Top}
        className=" !bg-teal-500"
      />
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-full h-full"
        onClick={(e) => {
          e.stopPropagation();
          data.onClick?.();
        }}
      >
        <PlusCircle className="" />
      </Button>
    </div>
  );
}
