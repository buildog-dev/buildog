"use client";

import React, { useState } from "react";
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

        // Navigate back to blog list
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

  const handlePreviewSave = async () => {
    await handleSave();
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        <p className="text-muted-foreground">
          Write and publish your blog post using our rich text editor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor Area */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blog Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your blog post title..."
                  className="text-xl font-semibold"
                />
              </div>

              <div>
                <Label htmlFor="preview">Preview/Excerpt (Optional)</Label>
                <Input
                  id="preview"
                  value={preview}
                  onChange={(e) => setPreview(e.target.value)}
                  placeholder="Brief description for social media and search engines..."
                />
              </div>

              <div>
                <Label>Content</Label>
                <Tiptap
                  content={content}
                  onChange={setContent}
                  placeholder="Start writing your blog post..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value: "draft" | "published" | "scheduled") => setStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tag1, tag2, tag3..."
                />
                <p className="text-sm text-muted-foreground mt-1">Separate tags with commas</p>
              </div>

              <div className="space-y-2">
                <Button onClick={handleSave} className="w-full" disabled={isLoading}>
                  {isLoading
                    ? "Saving..."
                    : status === "published"
                      ? "Publish Now"
                      : status === "scheduled"
                        ? "Schedule Post"
                        : "Save Draft"}
                </Button>

                {status !== "draft" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatus("draft");
                      handleSave();
                    }}
                    className="w-full"
                    disabled={isLoading}
                  >
                    Save as Draft
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Writing Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Select text to see formatting options</p>
              <p>• Click on empty lines for quick insertions</p>
              <p>• Use headings to structure your content</p>
              <p>• Add images by clicking the image icon</p>
              <p>• Create tables for organized data</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
