import { Button } from "@/components/ui/button";
import { Edge, Node } from "@xyflow/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

type EmailSequence = {
  subject: string;
  body: string;
  delay: string;
};

type ApiPayload = {
  emailAddress: string;
  emails: EmailSequence[];
};

type SaveScheduledButtonProps = {
  nodes: Node[];
  edges: Edge[];
};

const SaveScheduledButton = ({ nodes, edges }: SaveScheduledButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sequenceData, setSequenceData] = useState<ApiPayload | null>(null);

  const formatDelayString = (
    value: number,
    unit: "minutes" | "hours" | "days"
  ): string => {
    return `${value} ${unit}`;
  };

  const formatSequenceData = (): ApiPayload | null => {
    const leadSourceNode = nodes.find((node) => node.type === "leadSource");
    if (!leadSourceNode?.data.email) {
      console.error("No lead source email found");
      toast("No lead source email found");

      return null;
    }

    const emails: EmailSequence[] = [];
    let currentDelay = "";

    const sequenceEdges = edges.filter(
      (edge) => !edge.target.startsWith("add-")
    );

    let currentNodeId = leadSourceNode.id;

    while (true) {
      const nextEdge = sequenceEdges.find(
        (edge) => edge.source === currentNodeId
      );
      if (!nextEdge) break;

      const nextNode = nodes.find((node) => node.id === nextEdge.target);
      if (!nextNode) break;

      if (nextNode.type === "coldEmail") {
        emails.push({
          subject: nextNode.data.subject as string,
          body: nextNode.data.body as string,
          delay: currentDelay,
        });
        currentDelay = "";
      } else if (nextNode.type === "waitDelay") {
        currentDelay = formatDelayString(
          nextNode.data.value as number,
          nextNode.data.unit as "minutes" | "hours" | "days"
        );
      }

      currentNodeId = nextNode.id;
    }
    return {
      emailAddress: leadSourceNode.data.email as string,
      emails,
    };
  };

  const handleOpenDialog = () => {
    const data = formatSequenceData();
    if (!data) {
      console.error("Invalid sequence data");
      toast("Invalid sequence data");

      return;
    }

    if (data.emails.length === 0) {
      console.error("No emails in sequence");
      toast("No emails in sequence");
      return;
    }
    console.log("sequence data: ", data);
    setSequenceData(data);
    setIsDialogOpen(true);
  };

  const handleSaveAndSchedule = async () => {
    if (!sequenceData) return;

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${API_URL}/api/schedule-sequence`,
        sequenceData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Email sequence scheduled successfully!");
        setIsDialogOpen(false);
      } else {
        throw new Error(response.data.error || "Failed to schedule sequence");
      }
    } catch (error: unknown) {
      console.error("Error scheduling sequence:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to schedule email sequence"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <Button
          onClick={handleOpenDialog}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Save & Schedule
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Confirm Email Sequence</DialogTitle>
            <DialogDescription>
              Review your email sequence before scheduling
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Lead Source Email:</h4>
              <p className="text-sm text-gray-500">
                {sequenceData?.emailAddress}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Email Sequence:</h4>
              {sequenceData?.emails.map((email, index) => (
                <div
                  key={email.subject + index}
                  className="border rounded-lg p-3 space-y-2 text-sm"
                >
                  {email.delay && (
                    <p className="text-blue-600">Wait: {email.delay}</p>
                  )}
                  <p>
                    <span className="font-medium">Subject:</span>{" "}
                    {email.subject}
                  </p>
                  <p>
                    <span className="font-medium">Body:</span>{" "}
                    {email.body.length > 100
                      ? `${email.body.substring(0, 100)}...`
                      : email.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAndSchedule}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Confirm & Schedule"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SaveScheduledButton;
