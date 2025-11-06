"use client";
import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import { CustomeButton } from "@/components/ui/CustomeButton";
import CustomeSelect from "@/components/ui/customeSelect";
import { Button } from "../ui/button";

interface BulkActionsProps {
  selectedCategories: string[];
  categories: { id: string; name: string }[];
  onMergeCategories: (sourceIds: string[], targetId: string) => void;
  onDeleteCategories: (ids: string[]) => void;
  onMoveItems: (sourceIds: string[], targetId: string) => void;
  onClearSelection: () => void;
}

const BulkActions = ({
  selectedCategories,
  categories,
  onMergeCategories,
  onDeleteCategories,
  onMoveItems,
  onClearSelection,
}: BulkActionsProps) => {
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [targetCategory, setTargetCategory] = useState<string>("");

  const selectedCount = selectedCategories?.length;

  if (selectedCount === 0) return null;

  const availableTargets = categories?.filter(
    (cat) => !selectedCategories?.includes(cat?.id)
  );

  const handleMerge = () => {
    if (targetCategory && selectedCount > 1) {
      onMergeCategories(selectedCategories, targetCategory);
      setShowMergeModal(false);
      setTargetCategory("");
      onClearSelection();
    }
  };

  const handleMove = () => {
    if (targetCategory) {
      onMoveItems(selectedCategories, targetCategory);
      setShowMoveModal(false);
      setTargetCategory("");
      onClearSelection();
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedCount} categories? This action cannot be undone.`
      )
    ) {
      onDeleteCategories(selectedCategories);
      onClearSelection();
    }
  };

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="breathing-card bg-card border border-border rounded-xl shadow-gentle px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="CheckSquare" size={16} className="text-primary" />
              </div>
              <span className="text-sm font-medium text-text-primary">
                {selectedCount} selected
              </span>
            </div>

            <div className="h-6 w-px bg-border" />

            <div className="flex items-center space-x-2">
              {selectedCount > 1 && (
                <CustomeButton
                  variant="ghost"
                  size="sm"
                  iconName="Merge"
                  iconPosition="left"
                  onClick={() => setShowMergeModal(true)}
                  className="text-text-secondary hover:text-primary"
                >
                  Merge
                </CustomeButton>
              )}

              <CustomeButton
                variant="ghost"
                size="sm"
                iconName="Move"
                iconPosition="left"
                onClick={() => setShowMoveModal(true)}
                className="text-text-secondary hover:text-primary"
              >
                Move Items
              </CustomeButton>

              <CustomeButton
                variant="ghost"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
                onClick={handleDelete}
                className="text-text-secondary hover:text-destructive"
              >
                Delete
              </CustomeButton>

              <div className="h-6 w-px bg-border" />

              <CustomeButton
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={onClearSelection}
                className="text-text-secondary hover:text-text-primary"
              >
                Clear
              </CustomeButton>
            </div>
          </div>
        </div>
      </div>
      {/* Merge Modal */}
      {showMergeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-gentle max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Merge Categories
                </h3>
                <CustomeButton
                  variant="ghost"
                  size="icon"
                  iconName="X"
                  onClick={() => setShowMergeModal(false)}
                />
              </div>

              <p className="text-text-secondary text-sm mb-4">
                Select a target category to merge {selectedCount} categories
                into:
              </p>

              <CustomeSelect
                label="Target Category"
                placeholder="Choose target category"
                options={availableTargets?.map((cat) => ({
                  value: cat?.id,
                  label: cat?.name,
                }))}
                value={targetCategory}
                onChange={(value) => setTargetCategory(value as string)}
                className="mb-6"
              />

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowMergeModal(false)}
                >
                  Cancel
                </Button>
                <CustomeButton
                  variant="default"
                  onClick={handleMerge}
                  disabled={!targetCategory}
                  iconName="Merge"
                  iconPosition="left"
                >
                  Merge Categories
                </CustomeButton>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Move Items Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-gentle max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Move Items
                </h3>
                <CustomeButton
                  variant="ghost"
                  size="icon"
                  iconName="X"
                  onClick={() => setShowMoveModal(false)}
                />
              </div>

              <p className="text-text-secondary text-sm mb-4">
                Move all items from selected categories to:
              </p>

              <CustomeSelect
                label="Target Category"
                placeholder="Choose target category"
                options={availableTargets?.map((cat) => ({
                  value: cat?.id,
                  label: cat?.name,
                }))}
                value={targetCategory}
                onChange={(value) => setTargetCategory(value as string)}
                className="mb-6"
              />

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowMoveModal(false)}
                >
                  Cancel
                </Button>
                <CustomeButton
                  variant="default"
                  onClick={handleMove}
                  disabled={!targetCategory}
                  iconName="Move"
                  iconPosition="left"
                >
                  Move Items
                </CustomeButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;
