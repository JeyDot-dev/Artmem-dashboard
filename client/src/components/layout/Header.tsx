import { Download, FileJson, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { tactileSpring } from '@/lib/animations';

interface HeaderProps {
  onExportJSON: () => void;
  onExportTora: () => void;
  onImport: () => void;
  onHome: () => void;
}

export function Header({ onExportJSON, onExportTora, onImport, onHome }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <motion.button
          onClick={onHome}
          whileTap={{ scale: 0.97 }}
          transition={tactileSpring}
          className="flex items-center gap-2 group"
        >
          <img
            src="/tora.svg"
            alt="Tora"
            className="h-10 w-10 transition-transform duration-300 group-hover:rotate-12"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-accent-pink bg-clip-text text-transparent">
            Tora-chan Art Study Dashboard
          </span>
        </motion.button>

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
