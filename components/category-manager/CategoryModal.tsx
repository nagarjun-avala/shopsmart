import React, { useState, useEffect } from "react";
import Icon from "@/components/AppIcon";
import { CustomeButton } from "@/components/ui/CustomeButton";
import CustomeInput from "@/components/ui/CustomeInput";
import { Button } from "../ui/button";
import { CategoryType } from "@/types/all";

interface CategoryModalType {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: CategoryType) => void;
  category?: CategoryType | null;
  mode?: "create" | "edit";
}

const CategoryModal = ({
  isOpen,
  onClose,
  onSave,
  category,
  mode = "create", // 'create' or 'edit'
}: CategoryModalType) => {
  const [formData, setFormData] = useState({
    name: "",
    icon: "Package",
    color: "#3B82F6",
    id: "",
    slug: "",
    type: "custom" as "custom" | "system",
    isActive: true,
    itemCount: 0,
    frequency: "Never",
    usagePercentage: 0,
    lastUsed: "Never",
    recentItems: [] as string[],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (mode === "edit" && category) {
      setFormData({
        name: category.name || "",
        icon: category.icon || "Package",
        color: category.color || "#3B82F6",
        id: category.id || "",
        slug: category.slug || "",
        type: category.type || "custom",
        isActive: category.isActive ?? true,
        itemCount: category.itemCount || 0,
        frequency: category.frequency || "Never",
        usagePercentage: category.usagePercentage || 0,
        lastUsed: category.lastUsed || "Never",
        recentItems: category.recentItems || [],
        createdAt: category.createdAt instanceof Date ? category.createdAt : new Date(category.createdAt),
        updatedAt: category.updatedAt instanceof Date ? category.updatedAt : new Date(category.updatedAt),
      });
    } else if (mode === "create") {
      // Reset for create mode
      setFormData({
        name: "",
        icon: "Package",
        color: "#3B82F6",
        id: "",
        slug: "",
        type: "custom",
        isActive: true,
        itemCount: 0,
        frequency: "Never",
        usagePercentage: 0,
        lastUsed: "Never",
        recentItems: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    setErrors({});
  }, [mode, category?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  /* eslint-enable react-hooks/set-state-in-effect */

  const availableIcons = [
    "Package",
    "ShoppingCart",
    "Apple",
    "Banana",
    "Beef",
    "Milk",
    "Fish",
    "Carrot",
    "Coffee",
    "Wine",
    "Pill",
    "Shirt",
    "Home",
    "Car",
    "Gift",
    "Heart",
    "Star",
    "Zap",
    "Utensils",
    "Cookie",
    "IceCream",
    "Pizza",
    "Cake",
    "Candy",
  ];

  const availableColors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#EC4899",
    "#6366F1",
    "#14B8A6",
    "#DC2626",
    "#7C3AED",
    "#0891B2",
    "#65A30D",
    "#EA580C",
    "#DB2777",
    "#4F46E5",
    "#0D9488",
    "#A3E635",
    "#F43F5E",
    "#22D3EE",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData?.name?.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData?.name?.trim()?.length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e?.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        name: formData?.name?.trim(),
        slug: formData?.name?.trim()?.toLowerCase()?.replace(/\s+/g, "-"),
        updatedAt: new Date(),
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-gentle max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">
            {mode === "edit" ? "Edit Category" : "Create New Category"}
          </h2>
          <CustomeButton
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Name */}
          <CustomeInput
            label="Category Name"
            type="text"
            placeholder="Enter category name"
            value={formData?.name}
            onChange={(e) => handleInputChange("name", e?.target?.value)}
            error={errors?.name}
            required
          />

          {/* Icon Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-primary">
              Choose Icon
            </label>
            <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border border-border rounded-lg">
              {availableIcons?.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => handleInputChange("icon", iconName)}
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center calm-transition
                    ${formData?.icon === iconName
                      ? "bg-primary text-white shadow-soft"
                      : "bg-muted text-text-secondary hover:bg-primary/10 hover:text-primary"
                    }
                  `}
                >
                  <Icon name={iconName} size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-primary">
              Choose Color
            </label>
            <div className="grid grid-cols-10 gap-2">
              {availableColors?.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleInputChange("color", color)}
                  className={`
                    w-8 h-8 rounded-lg calm-transition
                    ${formData?.color === color
                      ? "ring-2 ring-offset-2 ring-primary scale-110"
                      : "hover:scale-105"
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-primary">
              Preview
            </label>
            <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shadow-soft"
                style={{ backgroundColor: formData?.color }}
              >
                <Icon
                  name={formData?.icon}
                  size={24}
                  color="white"
                  strokeWidth={2}
                />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">
                  {formData?.name || "Category Name"}
                </h3>
                <p className="text-sm text-text-secondary">0 items</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <CustomeButton
              type="submit"
              variant="default"
              iconName={mode === "edit" ? "Save" : "Plus"}
              iconPosition="left"
            >
              {mode === "edit" ? "Save Changes" : "Create Category"}
            </CustomeButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
