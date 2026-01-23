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
  });

  // Reset form data when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      setFormData(initialData || {
        title: '',
        author: '',
        platform: '',
        platformUrl: '',
        description: '',
        priority: 'medium',
        status: 'planned',
      });
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
