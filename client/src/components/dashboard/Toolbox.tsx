import { tools } from '../../config/toolbox';
import { ExternalLink } from 'lucide-react';

export function Toolbox() {
  const handleToolClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="border rounded-lg p-4 bg-card h-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Toolbox
        </h3>
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-3 gap-2 flex-1 content-start">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.url)}
              className="flex flex-col items-center gap-1.5 p-2 rounded hover:bg-primary/5 hover:border-primary/50 border border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-primary group h-fit"
              title={tool.description}
            >
              <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate w-full text-center">
                {tool.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
