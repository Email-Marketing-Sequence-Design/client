import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NodeSelectorProps {
  onSelect: (type: "coldEmail" | "waitDelay") => void;
  isOpen: boolean;
  onClose: () => void;
  lastNodeType?: string;
}

export function NodeSelector({
  onSelect,
  isOpen,
  onClose,
  lastNodeType,
}: Readonly<NodeSelectorProps>) {
  const canAddDelay = lastNodeType === "coldEmail";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Node Type</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              onSelect("coldEmail");
            }}
            className="flex items-center gap-2"
          >
            <span className="text-purple-500">✉</span>
            Add Email
          </Button>
          {canAddDelay && (
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                onSelect("waitDelay");
              }}
              className="flex items-center gap-2"
            >
              <span className="text-blue-500">⏱</span>
              Add Delay
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
