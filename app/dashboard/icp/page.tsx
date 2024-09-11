"use client";

import { useState, useEffect } from "react";
import { ICP } from "@/app/types/icp";
import { icpService } from "@/app/services/icpService";
import { Button } from "@/components/ui/button";
import ICPInfo from "@/components/icp-info";
import ICPForm from "@/app/components/icp/ICPForm";
import ICPDetail from "@/app/components/icp/ICPDetail";

export default function ICPPage() {
  const [icps, setIcps] = useState<ICP[]>([]);
  const [selectedICP, setSelectedICP] = useState<ICP | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedICP, setEditedICP] = useState<ICP | null>(null);

  useEffect(() => {
    fetchICPs();
  }, []);

  const fetchICPs = () => {
    const fetchedICPs = icpService.getICPs();
    setIcps(fetchedICPs);
  };

  const handleCreateICP = () => {
    setIsEditing(true);
    setEditedICP({
      name: "",
      industry: "",
      companySize: "",
      annualRevenue: "",
      location: "",
      painPoints: [],
      goals: [],
    });
    setSelectedICP(null);
  };

  const handleEditICP = (icp: ICP) => {
    setIsEditing(true);
    setEditedICP({ ...icp });
  };

  const handleDeleteICP = (id: string) => {
    icpService.deleteICP(id);
    fetchICPs();
    if (selectedICP?.id === id) {
      setSelectedICP(null);
    }
  };

  const handleSaveICP = () => {
    if (editedICP) {
      if (editedICP.id) {
        icpService.updateICP(editedICP);
      } else {
        icpService.addICP(editedICP);
      }
      fetchICPs();
      setIsEditing(false);
      setSelectedICP(editedICP);
      setEditedICP(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedICP(null);
  };

  const handleICPFormChange = (field: keyof ICP, value: string | string[]) => {
    setEditedICP((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {icps.length === 0 && !isEditing ? (
        <ICPInfo onCreateClick={handleCreateICP} />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Ideal Customer Profiles</h1>
            <Button onClick={handleCreateICP}>Create New ICP</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h2 className="text-xl font-semibold mb-4">ICP List</h2>
              <ul className="space-y-2">
                {icps.map((icp) => (
                  <li
                    key={icp.id}
                    className={`cursor-pointer hover:bg-gray-100 p-2 rounded ${
                      selectedICP?.id === icp.id ? "bg-gray-200" : ""
                    }`}
                    onClick={() => setSelectedICP(icp)}
                  >
                    {icp.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2">
              {isEditing && editedICP ? (
                <ICPForm
                  editedICP={editedICP}
                  onSave={handleSaveICP}
                  onCancel={handleCancelEdit}
                  onChange={handleICPFormChange}
                />
              ) : selectedICP ? (
                <ICPDetail
                  icp={selectedICP}
                  onEdit={handleEditICP}
                  onDelete={handleDeleteICP}
                />
              ) : (
                <p className="text-gray-600">
                  Select an ICP to view details or create a new one
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
