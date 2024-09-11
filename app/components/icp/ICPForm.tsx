import React from "react";
import { ICP } from "@/app/types/icp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ICPFormProps {
  editedICP: ICP;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: keyof ICP, value: string | string[]) => void;
}

const ICPForm: React.FC<ICPFormProps> = ({
  editedICP,
  onSave,
  onCancel,
  onChange,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        {editedICP.id ? "Edit ICP" : "Create New ICP"}
      </h2>
      <div className="space-y-4">
        <Input
          placeholder="Name"
          value={editedICP.name || ""}
          onChange={(e) => onChange("name", e.target.value)}
        />
        <Input
          placeholder="Industry"
          value={editedICP.industry || ""}
          onChange={(e) => onChange("industry", e.target.value)}
        />
        <Input
          placeholder="Company Size"
          value={editedICP.companySize || ""}
          onChange={(e) => onChange("companySize", e.target.value)}
        />
        <Input
          placeholder="Annual Revenue"
          value={editedICP.annualRevenue || ""}
          onChange={(e) => onChange("annualRevenue", e.target.value)}
        />
        <Input
          placeholder="Location"
          value={editedICP.location || ""}
          onChange={(e) => onChange("location", e.target.value)}
        />
        <Textarea
          placeholder="Pain Points (one per line)"
          value={editedICP.painPoints.join("\n") || ""}
          onChange={(e) => onChange("painPoints", e.target.value.split("\n"))}
        />
        <Textarea
          placeholder="Goals (one per line)"
          value={editedICP.goals.join("\n") || ""}
          onChange={(e) => onChange("goals", e.target.value.split("\n"))}
        />
      </div>
      <div className="mt-4 space-x-2">
        <Button onClick={onSave}>Save</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ICPForm;
