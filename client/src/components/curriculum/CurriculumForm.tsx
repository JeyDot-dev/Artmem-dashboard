import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Curriculum, CurriculumPriority, CurriculumStatus } from '../../../../shared/types';

interface CurriculumFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Curriculum>) => void;
  initialData?: Partial<Curriculum>;
}

export function CurriculumForm({ open, onClose, onSubmit, initialData }: CurriculumFormProps) {
  const [formData, setFormData] = useState<Partial<Curriculum>>({
    title: '',
    author: '',
    platform: '',
    platformUrl: '',
    description: '',
    priority: 'medium',
    status: 'planned',
    startDate: null,
    endDate: null,
  });

  // Helper to format date for input (YYYY-MM-DD)
  const formatDateForInput = (date: Date | string | null | undefined): string => {
    if (!date) return '';
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(d.getTime())) return '';
      // Format as YYYY-MM-DD for HTML date input
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  // Helper to parse date from input
  const parseDateFromInput = (value: string): Date | null => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };

  // Reset form data when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        // When editing, preserve all existing data including dates
        setFormData({
          title: initialData.title || '',
          author: initialData.author || '',
          platform: initialData.platform || '',
          platformUrl: initialData.platformUrl || '',
          description: initialData.description || '',
          priority: initialData.priority || 'medium',
          status: initialData.status || 'planned',
          startDate: initialData.startDate || null,
          endDate: initialData.endDate || null,
        });
      } else {
        // When creating new, use defaults
        setFormData({
          title: '',
          author: '',
          platform: '',
          platformUrl: '',
          description: '',
          priority: 'medium',
          status: 'planned',
          startDate: null,
          endDate: null,
        });
      }
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean up the data before submitting
    const cleanedData = {
      ...formData,
      // Convert empty strings to null for optional fields
      author: formData.author || null,
      platform: formData.platform || null,
      platformUrl: formData.platformUrl || null,
      description: formData.description || null,
      // Ensure dates are properly handled
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
    };
    onSubmit(cleanedData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData ? 'Edit Curriculum' : 'New Curriculum'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Anatomy for Artists"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Author</label>
              <Input
                value={formData.author || ''}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g., Proko"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Platform</label>
              <Input
                value={formData.platform || ''}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                placeholder="e.g., YouTube, Udemy"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Platform URL</label>
              <Input
                type="url"
                value={formData.platformUrl || ''}
                onChange={(e) => setFormData({ ...formData, platformUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the curriculum"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Priority</label>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as CurriculumPriority })}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Status</label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as CurriculumStatus })}
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="standby">Standby</option>
                  <option value="planned">Planned</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Start Date</label>
                <Input
                  type="date"
                  value={formatDateForInput(formData.startDate)}
                  onChange={(e) => setFormData({ ...formData, startDate: parseDateFromInput(e.target.value) })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">End Date Goal</label>
                <Input
                  type="date"
                  value={formatDateForInput(formData.endDate)}
                  onChange={(e) => setFormData({ ...formData, endDate: parseDateFromInput(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
