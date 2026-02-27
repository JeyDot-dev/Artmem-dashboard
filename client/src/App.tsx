import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { CurriculumDetailView } from './components/curriculum/CurriculumDetail';
import { CurriculumForm } from './components/curriculum/CurriculumForm';
import { SectionForm } from './components/curriculum/SectionForm';
import { ItemForm } from './components/curriculum/ItemForm';
import { ImportDropzone } from './components/common/ImportDropzone';
import * as api from './lib/api';
import { pageTransitionProps } from './lib/animations';
import type { Curriculum, Section, Item, ReorderRequest } from '../../shared/types';

export default function App() {
  const queryClient = useQueryClient();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<number | null>(null);
  const [showImport, setShowImport] = useState(false);

  // Form states
  const [curriculumFormOpen, setCurriculumFormOpen] = useState(false);
  const [editingCurriculum, setEditingCurriculum] = useState<Partial<Curriculum> | null>(null);
  const [sectionFormOpen, setSectionFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<{ section: Partial<Section>; curriculumId: number } | null>(null);
  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ item: Partial<Item>; sectionId: number } | null>(null);

  // Queries
  const { data: curriculums = [] } = useQuery({
    queryKey: ['curriculums'],
    queryFn: api.getCurriculums,
  });

  const { data: selectedCurriculum } = useQuery({
    queryKey: ['curriculum', selectedCurriculumId],
    queryFn: () => api.getCurriculum(selectedCurriculumId!),
    enabled: !!selectedCurriculumId,
  });

  // Mutations
  const createCurriculumMutation = useMutation({
    mutationFn: api.createCurriculum,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
      setSelectedCurriculumId(data.id);
    },
  });

  const updateCurriculumMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Curriculum> }) => api.updateCurriculum(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
      queryClient.invalidateQueries({ queryKey: ['curriculum', selectedCurriculumId] });
    },
  });

  const deleteCurriculumMutation = useMutation({
    mutationFn: api.deleteCurriculum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
      setSelectedCurriculumId(null);
    },
  });

  const createSectionMutation = useMutation({
    mutationFn: ({ curriculumId, data }: { curriculumId: number; data: Partial<Section> }) =>
      api.createSection(curriculumId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', selectedCurriculumId] });
    },
  });

  const updateSectionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Section> }) => api.updateSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', selectedCurriculumId] });
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: api.deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', selectedCurriculumId] });
    },
  });

  const createItemMutation = useMutation({
    mutationFn: ({ sectionId, data }: { sectionId: number; data: Partial<Item> }) =>
      api.createItem(sectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', selectedCurriculumId] });
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Item> }) => api.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', selectedCurriculumId] });
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: api.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', selectedCurriculumId] });
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
    },
  });

  const cycleItemStatusMutation = useMutation({
    mutationFn: api.cycleItemStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', selectedCurriculumId] });
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
    },
  });

  // V4: Reorder curriculum mutation
  const reorderCurriculumMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReorderRequest }) => 
      api.reorderCurriculum(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', selectedCurriculumId] });
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
    },
  });

  const importCurriculumMutation = useMutation({
    mutationFn: api.importCurriculum,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
      setSelectedCurriculumId(data.id);
      setShowImport(false);
      alert('Curriculum imported successfully!');
    },
    onError: () => {
      alert('Failed to import curriculum. Please check the JSON format.');
    },
  });

  // Handlers
  const handleExportJSON = async () => {
    try {
      await api.exportJSON();
    } catch (error) {
      alert('Export failed');
    }
  };

  const handleExportTora = async () => {
    try {
      await api.exportToraMemoryPack();
    } catch (error) {
      alert('Export failed');
    }
  };

  const handleImport = (data: any) => {
    if (Array.isArray(data)) {
      // Multiple curriculums
      data.forEach((curriculum) => importCurriculumMutation.mutate(curriculum));
    } else {
      // Single curriculum
      importCurriculumMutation.mutate(data);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header
        onExportJSON={handleExportJSON}
        onExportTora={handleExportTora}
        onImport={() => setShowImport(!showImport)}
        onHome={() => setSelectedCurriculumId(null)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          curriculums={curriculums}
          selectedId={selectedCurriculumId}
          onSelect={setSelectedCurriculumId}
          onAddNew={() => {
            setEditingCurriculum(null);
            setCurriculumFormOpen(true);
          }}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <AnimatePresence mode="wait">
            {showImport ? (
              <motion.div key="import" {...pageTransitionProps}>
                <ImportDropzone onImport={handleImport} />
              </motion.div>
            ) : selectedCurriculum ? (
              <motion.div key={`curriculum-${selectedCurriculum.id}`} {...pageTransitionProps}>
                <CurriculumDetailView
                  curriculum={selectedCurriculum}
                  onEdit={() => {
                    setEditingCurriculum(selectedCurriculum);
                    setCurriculumFormOpen(true);
                  }}
                  onDelete={() => {
                    if (confirm('Delete this curriculum? This cannot be undone.')) {
                      deleteCurriculumMutation.mutate(selectedCurriculum.id);
                    }
                  }}
                  onAddSection={() => {
                    setEditingSection(null);
                    setSectionFormOpen(true);
                  }}
                  onEditSection={(sectionId) => {
                    const section = selectedCurriculum.sections.find((s) => s.id === sectionId);
                    if (section) {
                      setEditingSection({ section, curriculumId: selectedCurriculum.id });
                      setSectionFormOpen(true);
                    }
                  }}
                  onDeleteSection={(sectionId) => {
                    if (confirm('Delete this section? This cannot be undone.')) {
                      deleteSectionMutation.mutate(sectionId);
                    }
                  }}
                  onAddItem={(sectionId) => {
                    setEditingItem({ item: {}, sectionId });
                    setItemFormOpen(true);
                  }}
                  onEditItem={(itemId) => {
                    for (const section of selectedCurriculum.sections) {
                      const item = section.items.find((i) => i.id === itemId);
                      if (item) {
                        setEditingItem({ item, sectionId: section.id });
                        setItemFormOpen(true);
                        break;
                      }
                    }
                  }}
                  onDeleteItem={(itemId) => {
                    if (confirm('Delete this item?')) {
                      deleteItemMutation.mutate(itemId);
                    }
                  }}
                  onCycleItemStatus={(itemId) => cycleItemStatusMutation.mutate(itemId)}
                  onReorder={async (curriculumId, data) => {
                    await reorderCurriculumMutation.mutateAsync({ id: curriculumId, data });
                  }}
                />
              </motion.div>
            ) : (
              <motion.div key="dashboard" {...pageTransitionProps}>
                <Dashboard
                  curriculums={curriculums}
                  onSelectCurriculum={setSelectedCurriculumId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <CurriculumForm
        open={curriculumFormOpen}
        onClose={() => {
          setCurriculumFormOpen(false);
          setEditingCurriculum(null);
        }}
        onSubmit={(data) => {
          if (editingCurriculum?.id) {
            updateCurriculumMutation.mutate({ id: editingCurriculum.id, data });
          } else {
            createCurriculumMutation.mutate(data);
          }
        }}
        initialData={editingCurriculum || undefined}
      />

      <SectionForm
        open={sectionFormOpen}
        onClose={() => {
          setSectionFormOpen(false);
          setEditingSection(null);
        }}
        onSubmit={(data) => {
          if (editingSection?.section.id) {
            updateSectionMutation.mutate({ id: editingSection.section.id, data });
          } else if (selectedCurriculumId) {
            createSectionMutation.mutate({ curriculumId: selectedCurriculumId, data });
          }
        }}
        initialData={editingSection?.section}
      />

      <ItemForm
        open={itemFormOpen}
        onClose={() => {
          setItemFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={(data) => {
          if (editingItem?.item.id) {
            updateItemMutation.mutate({ id: editingItem.item.id, data });
          } else if (editingItem?.sectionId) {
            createItemMutation.mutate({ sectionId: editingItem.sectionId, data });
          }
        }}
        initialData={editingItem?.item}
      />
    </div>
  );
}
