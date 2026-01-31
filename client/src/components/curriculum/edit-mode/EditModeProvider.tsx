import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CurriculumDetail, SectionWithItems, Item, ReorderRequest } from '../../../../../shared/types';

interface EditModeState {
  isEditMode: boolean;
  isDirty: boolean;
  localCurriculum: CurriculumDetail | null;
  collapsedSections: Set<number>;
  allExpanded: boolean;
}

interface EditModeContextValue extends EditModeState {
  enterEditMode: (curriculum: CurriculumDetail) => void;
  exitEditMode: () => void;
  reorderSections: (activeIndex: number, overIndex: number) => void;
  reorderItems: (sectionId: number, activeIndex: number, overIndex: number) => void;
  toggleAllSections: () => void;
  collapseSection: (sectionId: number) => void;
  expandSection: (sectionId: number) => void;
  save: () => Promise<void>;
}

const EditModeContext = createContext<EditModeContextValue | null>(null);

interface EditModeProviderProps {
  children: ReactNode;
  onSave: (curriculumId: number, data: ReorderRequest) => Promise<void>;
}

export function EditModeProvider({ children, onSave }: EditModeProviderProps) {
  const [state, setState] = useState<EditModeState>({
    isEditMode: false,
    isDirty: false,
    localCurriculum: null,
    collapsedSections: new Set(),
    allExpanded: true,
  });

  const enterEditMode = useCallback((curriculum: CurriculumDetail) => {
    // Deep clone to prevent mutations affecting the original data
    const clonedCurriculum: CurriculumDetail = JSON.parse(JSON.stringify(curriculum));
    
    setState({
      isEditMode: true,
      isDirty: false,
      localCurriculum: clonedCurriculum,
      collapsedSections: new Set(),
      allExpanded: true,
    });
  }, []);

  const exitEditMode = useCallback(() => {
    if (state.isDirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to exit?'
      );
      if (!confirmed) return;
    }
    
    setState({
      isEditMode: false,
      isDirty: false,
      localCurriculum: null,
      collapsedSections: new Set(),
      allExpanded: true,
    });
  }, [state.isDirty]);

  const reorderSections = useCallback((activeIndex: number, overIndex: number) => {
    setState((prev) => {
      if (!prev.localCurriculum) return prev;

      const sections = [...prev.localCurriculum.sections];
      const [movedSection] = sections.splice(activeIndex, 1);
      sections.splice(overIndex, 0, movedSection);

      // Update sortOrder for all sections
      const updatedSections = sections.map((section, index) => ({
        ...section,
        sortOrder: index,
      }));

      return {
        ...prev,
        localCurriculum: {
          ...prev.localCurriculum,
          sections: updatedSections,
        },
        isDirty: true,
      };
    });
  }, []);

  const reorderItems = useCallback((sectionId: number, activeIndex: number, overIndex: number) => {
    setState((prev) => {
      if (!prev.localCurriculum) return prev;

      const sections = prev.localCurriculum.sections.map((section) => {
        if (section.id !== sectionId) return section;

        const items = [...section.items];
        const [movedItem] = items.splice(activeIndex, 1);
        items.splice(overIndex, 0, movedItem);

        // Update sortOrder for all items
        const updatedItems = items.map((item, index) => ({
          ...item,
          sortOrder: index,
        }));

        return {
          ...section,
          items: updatedItems,
        };
      });

      return {
        ...prev,
        localCurriculum: {
          ...prev.localCurriculum,
          sections,
        },
        isDirty: true,
      };
    });
  }, []);

  const toggleAllSections = useCallback(() => {
    setState((prev) => {
      if (!prev.localCurriculum) return prev;

      if (prev.allExpanded) {
        // Collapse all
        const allSectionIds = new Set(prev.localCurriculum.sections.map((s) => s.id));
        return { ...prev, collapsedSections: allSectionIds, allExpanded: false };
      } else {
        // Expand all
        return { ...prev, collapsedSections: new Set(), allExpanded: true };
      }
    });
  }, []);

  const collapseSection = useCallback((sectionId: number) => {
    setState((prev) => {
      const newCollapsed = new Set(prev.collapsedSections);
      newCollapsed.add(sectionId);
      return { ...prev, collapsedSections: newCollapsed };
    });
  }, []);

  const expandSection = useCallback((sectionId: number) => {
    setState((prev) => {
      const newCollapsed = new Set(prev.collapsedSections);
      newCollapsed.delete(sectionId);
      return { ...prev, collapsedSections: newCollapsed };
    });
  }, []);

  const save = useCallback(async () => {
    if (!state.localCurriculum || !state.isDirty) return;

    // Build the reorder request from local state
    const reorderData: ReorderRequest = {
      sections: state.localCurriculum.sections.map((section) => ({
        id: section.id,
        sortOrder: section.sortOrder,
        items: section.items.map((item) => ({
          id: item.id,
          sortOrder: item.sortOrder,
        })),
      })),
    };

    await onSave(state.localCurriculum.id, reorderData);

    // Exit edit mode after successful save
    setState({
      isEditMode: false,
      isDirty: false,
      localCurriculum: null,
      collapsedSections: new Set(),
      allExpanded: true,
    });
  }, [state.localCurriculum, state.isDirty, onSave]);

  const value: EditModeContextValue = {
    ...state,
    enterEditMode,
    exitEditMode,
    reorderSections,
    reorderItems,
    toggleAllSections,
    collapseSection,
    expandSection,
    save,
  };

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditMode must be used within EditModeProvider');
  }
  return context;
}
