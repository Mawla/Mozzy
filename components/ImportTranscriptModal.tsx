import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImportTranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (content: string) => void;
}

const ImportTranscriptModal: React.FC<ImportTranscriptModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [pastedContent, setPastedContent] = useState("");
  const [activeTab, setActiveTab] = useState("file");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith(".srt")) {
      setFile(selectedFile);
    } else {
      alert("Please select a valid .srt file");
      setFile(null);
    }
  };

  const handleImport = async () => {
    let content = "";
    if (activeTab === "file" && file) {
      content = await file.text();
    } else if (activeTab === "paste") {
      content = pastedContent;
    }

    if (content) {
      onImport(content);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Transcript</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">File Upload</TabsTrigger>
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
          </TabsList>
          <TabsContent value="file" className="space-y-4">
            <Input type="file" accept=".srt" onChange={handleFileChange} />
            <Button onClick={handleImport} disabled={!file}>
              Import File
            </Button>
          </TabsContent>
          <TabsContent value="paste" className="space-y-4">
            <Textarea
              placeholder="Paste your transcript here..."
              value={pastedContent}
              onChange={(e) => setPastedContent(e.target.value)}
              rows={10}
            />
            <Button onClick={handleImport} disabled={!pastedContent}>
              Import Pasted Text
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImportTranscriptModal;
