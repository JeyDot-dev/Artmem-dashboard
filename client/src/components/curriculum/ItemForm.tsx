import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Item, ItemType } from '../../../../shared/types';

interface ItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Item>) => void;
  initialData?: Partial<Item>;
}

export function ItemForm({ open, onClose, onSubmit, initialData }: ItemFormProps) {
  const [formData, setFormData] = useState<Partial<Item>>({
    title: '',
    description: '',
    type: 'other',
  });

  // Reset form data when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      setFormData(initialData || {
        title: '',
        description: '',
        type: 'other',
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
            <DialogTitle>{initialData ? 'Edit Item' : 'New Item'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Watch: Introduction to Anatomy"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Type</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ItemType })}
              >
                <option value="video">Video</option>
                <option value="reading">Reading</option>
                <option value="exercise">Exercise</option>
                <option value="homework">Homework</option>
                <option value="other">Other</option>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional notes or details"
                rows={3}
              />
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
