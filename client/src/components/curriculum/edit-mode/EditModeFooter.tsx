import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditMode } from './EditModeProvider';

export function EditModeFooter() {
  const { isEditMode, isDirty, allExpanded, toggleAllSections, exitEditMode, save } = useEditMode();

  return (
    <AnimatePresence>
      {isEditMode && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <div className="container flex items-center justify-between gap-4 py-3 px-4">
            {/* Toggle Tasks Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllSections}
              className="gap-2"
            >
              {allExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Expand All
                </>
              )}
            </Button>

            <div className="flex items-center gap-2">
              {/* Exit Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={exitEditMode}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Exit
              </Button>

              {/* Save Button */}
              <Button
                size="sm"
                onClick={save}
                disabled={!isDirty}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
