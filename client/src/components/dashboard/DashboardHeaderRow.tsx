import { Toolbox } from './Toolbox';
import { PixivWidget } from './PixivWidget';

export function DashboardHeaderRow() {
  return (
    <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Toolbox - Quick access to external tools */}
      <Toolbox />

      {/* Pixiv Inspiration - Random daily ranking illustration */}
      <PixivWidget />
    </div>
  );
}
