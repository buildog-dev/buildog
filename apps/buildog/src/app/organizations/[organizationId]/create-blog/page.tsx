"use client";

import React, { useState, useEffect } from "react";
import { Tiptap } from "@repo/editor/src";
import { useParams, useRouter } from "next/navigation";
import { Service } from "@/web-sdk";
import { useAuth } from "@/components/auth-provider";
import { toast } from "@repo/ui/components/ui/use-toast";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";

export default function Page() {
  // const { user } = useAuth(); // later if needed
  const params = useParams();
  const router = useRouter();
  const { organizationId } = params;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("draft");
  const [tags, setTags] = useState<string>("");
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [publishTitle, setPublishTitle] = useState("");

  // auto-save handler
  const handleAutoSave = (blogData: {
    header: string | null;
    content: string;
    image: string | null;
  }) => {
    console.log("HandleAutoSave called with blogData:", JSON.stringify(blogData, null, 2));

    // we can store in localStorage or send to backend here
    localStorage.setItem(
      `blog-draft-${organizationId}`,
      JSON.stringify({
        ...blogData,
        timestamp: new Date().toISOString(),
        organizationId,
      })
    );
  };

  // load saved draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(`blog-draft-${organizationId}`);
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);

        if (draftData.content) {
          setContent(draftData.content);
        }
        if (draftData.header && !title) {
          setTitle(draftData.header);
        }
      } catch (error) {
        console.error("Error loading saved draft:", error);
      }
    }
  }, [organizationId, title]);

  // clear saved draft when successfully published
  const clearSavedDraft = () => {
    localStorage.removeItem(`blog-draft-${organizationId}`);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your blog post.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim() || content === "<p></p>") {
      toast({
        title: "Content required",
        description: "Please write some content for your blog post.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await Service.makeAuthenticatedRequest(
        "documents",
        "POST",
        {
          organization_id: organizationId,
          name: title.toLowerCase().replace(/\s+/g, "-"),
          title: title,
          preview: preview || content.replace(/<[^>]*>/g, "").substring(0, 200),
          status: status,
          tags: tagsArray,
        },
        {
          organization_id: organizationId as string,
        }
      );

      if (response) {
        toast({
          title: "Blog post saved!",
          description: `Your blog post "${title}" has been ${status === "published" ? "published" : "saved as " + status}.`,
        });

        // clear saved draft when successfully saved/published
        clearSavedDraft();

        // navigate back to blog list
        router.push(`/organizations/${organizationId}/blog`);
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast({
        title: "Failed to save blog post",
        description: "There was an error saving your blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!publishTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your blog post.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim() || content === "<p></p>") {
      toast({
        title: "Content required",
        description: "Please write some content for your blog post.",
        variant: "destructive",
      });
      return;
    }

    setTitle(publishTitle);
    setStatus("published");
    setIsLoading(true);

    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await Service.makeAuthenticatedRequest(
        "documents",
        "POST",
        {
          organization_id: organizationId,
          name: publishTitle.toLowerCase().replace(/\s+/g, "-"),
          title: publishTitle,
          preview: preview || content.replace(/<[^>]*>/g, "").substring(0, 200),
          status: "published",
          tags: tagsArray,
        },
        {
          organization_id: organizationId as string,
        }
      );

      if (response) {
        toast({
          title: "Blog post published!",
          description: `Your blog post "${publishTitle}" has been published successfully.`,
        });

        // clear saved draft when successfully published
        clearSavedDraft();

        setIsPublishDialogOpen(false);
        // navigate back to blog list
        router.push(`/organizations/${organizationId}/blog`);
      }
    } catch (error) {
      console.error("Error publishing blog post:", error);
      toast({
        title: "Failed to publish blog post",
        description: "There was an error publishing your blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPublishDialog = () => {
    setPublishTitle(title);
    setIsPublishDialogOpen(true);
  };

  const handlePreviewSave = async () => {
    await handleSave();
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenPublishDialog}
              className="text-white bg-black dark:text-black dark:bg-white"
              disabled={isLoading}
            >
              Publish
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Publish Blog Post</DialogTitle>
              <DialogDescription>
                Enter a title for your blog post and publish it to make it live.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="publish-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="publish-title"
                  value={publishTitle}
                  onChange={(e) => setPublishTitle(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter blog post title..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPublishDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handlePublish}
                disabled={isLoading || !publishTitle.trim()}
                className="text-white bg-black dark:text-black dark:bg-white"
              >
                {isLoading ? "Publishing..." : "Publish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Editor Area */}
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4">
              <div>
                <Tiptap content={content} onChange={setContent} onAutoSave={handleAutoSave} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
