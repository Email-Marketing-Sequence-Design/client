import { Button } from "@/components/ui/button";

interface NodeSelectorProps {
  onSelect: (type: "coldEmail" | "waitDelay") => void;
  position?: { x: number; y: number };
  lastNodeType?: string;
}

export function NodeSelector({
  onSelect,
  position,
  lastNodeType,
}: Readonly<NodeSelectorProps>) {
  const canAddDelay = lastNodeType === "coldEmail";
  return (
    <div
      className="absolute bg-white p-4 rounded-md shadow-md z-50"
      style={{
        left: position ? `${position.x + 50}px` : "2rem",
        top: position ? `${position.y}px` : "2rem",
      }}
    >
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          onClick={() => onSelect("coldEmail")}
          className="flex items-center gap-2"
        >
          <span className="text-purple-500">✉</span>
          Add Email
        </Button>
        {canAddDelay && (
          <Button
            variant="outline"
            onClick={() => onSelect("waitDelay")}
            className="flex items-center gap-2"
          >
            <span className="text-blue-500">⏱</span>
            Add Delay
          </Button>
        )}
      </div>
    </div>
  );
}
