"use client";

import { useState, useEffect } from "react";
import { Idea, ideasService } from "@/app/services/ideasService";

const IdeasPage = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdea, setNewIdea] = useState({ title: "", description: "" });

  useEffect(() => {
    setIdeas(ideasService.getAllIdeas());
  }, []);

  const handleCreateIdea = () => {
    if (newIdea.title && newIdea.description) {
      const createdIdea = ideasService.createIdea(
        newIdea.title,
        newIdea.description
      );
      setIdeas([...ideas, createdIdea]);
      setNewIdea({ title: "", description: "" });
    }
  };

  const handleDeleteIdea = (id: string) => {
    ideasService.deleteIdea(id);
    setIdeas(ideas.filter((idea) => idea.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ideas</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Title"
          value={newIdea.title}
          onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={newIdea.description}
          onChange={(e) =>
            setNewIdea({ ...newIdea, description: e.target.value })
          }
          className="border p-2 mr-2"
        />
        <button
          onClick={handleCreateIdea}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Idea
        </button>
      </div>

      <ul>
        {ideas.map((idea) => (
          <li key={idea.id} className="mb-4 p-4 border rounded">
            <h2 className="text-xl font-semibold">{idea.title}</h2>
            <p>{idea.description}</p>
            <button
              onClick={() => handleDeleteIdea(idea.id)}
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IdeasPage;
