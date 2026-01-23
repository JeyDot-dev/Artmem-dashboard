import { Download, FileJson, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onExportJSON: () => void;
  onExportTora: () => void;
  onImport: () => void;
}

export function Header({ onExportJSON, onExportTora, onImport }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Tora-chan Art Study Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onImport}>
            <Download className="h-4 w-4 mr-2" />
            Import JSON
          </Button>
          <Button variant="outline" size="sm" onClick={onExportJSON}>
            <FileJson className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button size="sm" onClick={onExportTora}>
            <Package className="h-4 w-4 mr-2" />
            Export to Tora-chan
          </Button>
        </div>
      </div>
    </header>
  );
}
