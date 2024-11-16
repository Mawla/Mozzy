"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Template } from "@/app/types/template";
import { useTemplateStore } from "@/app/stores/templateStore";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TemplateDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { templates } = useTemplateStore();
  const [template, setTemplate] = useState<Template | null>(null);

  useEffect(() => {
    const templateId = params.id as string;
    const found = templates.find((t) => t.id === templateId);
    if (found) {
      setTemplate(found);
    }
  }, [params.id, templates]);

  if (!template) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Template not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            <span className="mr-2">{template.emoji}</span>
            {template.title}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{template.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Category</h3>
                <p className="text-gray-600 capitalize">{template.category}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Template Content</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {template.content}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
