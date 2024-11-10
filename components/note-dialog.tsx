"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, StickyNote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface NoteDialogProps {
  investorId: string;
  existingNote?: string;
  isLoading?: boolean;
}

export function NoteDialog({
  investorId,
  existingNote,
  isLoading: isLoadingNote,
}: NoteDialogProps) {
  const { data: session } = useSession();
  const [note, setNote] = useState(existingNote || "");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (existingNote !== undefined) {
      setNote(existingNote);
    }
  }, [existingNote]);

  const handleSave = async () => {
    if (!session?.user) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: note.trim(),
          investorId,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to save note");
      }

      await queryClient.invalidateQueries({ queryKey: ["note", investorId] });

      toast({
        title: "Note saved successfully",
        description: "Your note has been saved for this investor.",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error saving note",
        description:
          error instanceof Error ? error.message : "Failed to save note",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative hover:bg-secondary"
          disabled={isLoadingNote}
        >
          {isLoadingNote ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <StickyNote className="h-4 w-4" />
          )}
          {existingNote && !isLoadingNote && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingNote ? "Edit Note" : "Add Note"}</DialogTitle>
          <DialogDescription>
            Add your private note about this investor. Only you can see this
            note.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Enter your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[150px] resize-none"
            disabled={isLoading}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={isLoading || !note.trim()}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Note"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
