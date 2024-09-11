import React from "react";
import { ICP } from "@/app/types/icp";
import { Button } from "@/components/ui/button";

interface ICPDetailProps {
  icp: ICP;
  onEdit: (icp: ICP) => void;
  onDelete: (id: string) => void;
}

const ICPDetail: React.FC<ICPDetailProps> = ({ icp, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{icp.name}</h2>
      <p>
        <strong>Industry:</strong> {icp.industry}
      </p>
      <p>
        <strong>Company Size:</strong> {icp.companySize}
      </p>
      <p>
        <strong>Annual Revenue:</strong> {icp.annualRevenue}
      </p>
      <p>
        <strong>Location:</strong> {icp.location}
      </p>
      <h3 className="text-xl font-semibold mt-4 mb-2">Pain Points:</h3>
      <ul className="list-disc pl-5">
        {icp.painPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      <h3 className="text-xl font-semibold mt-4 mb-2">Goals:</h3>
      <ul className="list-disc pl-5">
        {icp.goals.map((goal, index) => (
          <li key={index}>{goal}</li>
        ))}
      </ul>
      <div className="mt-4 space-x-2">
        <Button onClick={() => onEdit(icp)}>Edit</Button>
        <Button variant="destructive" onClick={() => onDelete(icp.id!)}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ICPDetail;
