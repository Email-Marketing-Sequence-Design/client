import { Button } from "@/components/ui/button";
import { Node } from "@xyflow/react";
import { PlusCircle, UserPlus } from "lucide-react";

interface AddNodesPanelProps {
  nodes: Node[];
  onAddLeadSource: () => void;
  onAddNodeButton: () => void;
}

export function AddNodesPanel({
  nodes,
  onAddLeadSource,
  onAddNodeButton,
}: Readonly<AddNodesPanelProps>) {
  const hasLeadSource = nodes.some((node) => node.type === "leadSource");
  const hasAddLeadSourceButton = nodes.some(
    (node) => node.type === "addLeadSource"
  );
  const hasAddNodeButton = nodes.some((node) => node.type === "addButton");

  // Show add lead source option only if there's no lead source and no add lead source button
  const showAddLeadSource = !hasLeadSource && !hasAddLeadSourceButton;
  // Show add node button option if there's no add node button
  const showAddNodeButton = !hasAddNodeButton;

  if (!showAddLeadSource && !showAddNodeButton) return null;

  return (
    <div className="flex flex-col gap-2 bg-white p-3 rounded-lg shadow-lg border border-gray-200">
      <div className="text-sm font-medium text-gray-500 mb-1">
        Add Missing Nodes
      </div>
      {showAddLeadSource && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAddLeadSource}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 border-teal-200"
        >
          <UserPlus className="h-4 w-4" />
          Add Lead Source
        </Button>
      )}
      {showAddNodeButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAddNodeButton}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
        >
          <PlusCircle className="h-4 w-4" />
          Add Node Button
        </Button>
      )}
    </div>
  );
}
