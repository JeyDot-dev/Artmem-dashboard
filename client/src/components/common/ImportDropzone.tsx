import { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface ImportDropzoneProps {
  onImport: (data: any) => void;
}

export function ImportDropzone({ onImport }: ImportDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      readFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        onImport(data);
      } catch (error) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleTextImport = () => {
    if (!jsonText.trim()) {
      alert('Please paste JSON data');
      return;
    }

    try {
      const data = JSON.parse(jsonText);
      onImport(data);
      setJsonText(''); // Clear after successful import
    } catch (error) {
      alert('Invalid JSON format. Please check your input.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="file">Upload File</TabsTrigger>
          <TabsTrigger value="text">Paste JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Card
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed cursor-pointer transition-all hover:border-primary',
              isDragging && 'border-primary bg-primary/5'
            )}
          >
            <div className="py-12 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-1">Drop JSON file here</p>
              <p className="text-sm text-muted-foreground">or click to select a file</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="text">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Paste JSON Data</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Paste your curriculum JSON data below. Supports single curriculum or array of curriculums.
                  </p>
                  <Textarea
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    placeholder='{"title": "My Curriculum", "sections": [...], ...}'
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleTextImport} className="w-32">
                  Import
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
