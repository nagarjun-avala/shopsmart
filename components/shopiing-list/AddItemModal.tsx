import React, { useState } from 'react';
import { CustomeButton } from '@/components/ui/CustomeButton';
import CustomeInput from '@/components/ui/CustomeInput';
import CustomeSelect from '@/components/ui/customeSelect';
import { formatCurrency } from '@/lib/currency';
import { NewShoppingItem } from '@/types/all';

interface Category {
    id: string;
    name: string;
}

interface FormData {
    name: string;
    quantity: string;
    unit: string;
    categoryId: string;
    brand: string;
    note: string;
    priority: 'low' | 'medium' | 'high';
    estimatedPrice: string;
}

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddItem: (item: NewShoppingItem) => void;
    categories: Category[];
    listName?: string
    categoryLoading?: boolean
    loading?: boolean;
    error?: string | null;
}


const initialFormData: FormData = {
    name: '',
    quantity: '1',
    unit: 'piece',
    categoryId: '',
    brand: '',
    note: '',
    priority: 'low',
    estimatedPrice: ''
};

const AddItemModal: React.FC<AddItemModalProps> = ({ categoryLoading = false, listName, isOpen, onClose, onAddItem, categories }) => {
    const selectedCurrency = 'INR'; // TODO: Move to currency context
    const [formData, setFormData] = useState<FormData>(initialFormData);

    const unitOptions = [
        { value: 'piece', label: 'Piece(s)' },
        { value: 'lb', label: 'Pounds' },
        { value: 'kg', label: 'Kilograms' },
        { value: 'oz', label: 'Ounces' },
        { value: 'g', label: 'Grams' },
        { value: 'liter', label: 'Liters' },
        { value: 'ml', label: 'Milliliters' },
        { value: 'cup', label: 'Cups' },
        { value: 'tbsp', label: 'Tablespoons' },
        { value: 'tsp', label: 'Teaspoons' },
        { value: 'pack', label: 'Pack(s)' },
        { value: 'bottle', label: 'Bottle(s)' },
        { value: 'can', label: 'Can(s)' },
        { value: 'box', label: 'Box(es)' }
    ];

    const priorityOptions = [
        { value: 'low', label: 'Low Priority' },
        { value: 'medium', label: 'Medium Priority' },
        { value: 'high', label: 'High Priority' }
    ];

    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.name
    }));

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        const newItem: NewShoppingItem = {
            name: formData.name.trim(),
            quantity: parseFloat(formData.quantity) || 1,
            unit: formData.unit,
            priority: formData.priority,
            completed: false,
            note: formData.note.trim() || undefined,
            categoryId: formData.categoryId,
            brand: formData.brand.trim() || undefined,
            estimatedPrice: formData.estimatedPrice ? parseFloat(formData.estimatedPrice) : undefined,
            listId: ''
        };


        onAddItem(newItem);
        setFormData(initialFormData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-primary-foreground rounded-xl shadow-gentle max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-text-primary">Add New Item to {listName}</h2>
                    <CustomeButton
                        variant="ghost"
                        size="icon"
                        iconName="X"
                        onClick={onClose}
                        className="text-text-secondary hover:text-text-primary"
                    />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <CustomeInput
                        label="Item Name"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                        required
                    />

                    {/* Quantity and Unit */}
                    <div className="grid grid-cols-2 gap-4">
                        <CustomeInput
                            label="Quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                            placeholder="1"
                            min="0"
                            step="0.1"
                        />

                        <CustomeSelect
                            label="Unit"
                            options={unitOptions}
                            value={formData.unit}
                            onChange={(value) =>
                                setFormData(prev => ({ ...prev, unit: value as string }))
                            }
                            placeholder="Select unit"
                        />
                    </div>

                    {/* Category */}
                    <CustomeSelect
                        label="Category"
                        placeholder="Select category"
                        loading={categoryLoading}
                        options={categoryOptions}
                        value={formData.categoryId}
                        onChange={(value) => handleInputChange('categoryId', value as string)}
                        required
                    />

                    <CustomeInput
                        label="Brand (Optional)"
                        value={formData.brand}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                        placeholder="Brand name"
                    />

                    {/* Priority */}
                    <CustomeSelect
                        label="Priority"
                        options={priorityOptions}
                        value={formData.priority}
                        onChange={(value) => handleInputChange('priority', value as string)}
                    />

                    {/* Estimated Price */}
                    <CustomeInput
                        label={`Estimated Price (${selectedCurrency})`}
                        type="number"
                        value={formData.estimatedPrice}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, estimatedPrice: e.target.value }))}
                        placeholder={formatCurrency(0, selectedCurrency)}
                        min="0"
                        step="0.01"
                    />

                    {/* Note */}
                    <CustomeInput
                        label="Note (Optional)"
                        type="text"
                        placeholder="Any special instructions or preferences"
                        value={formData.note}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('note', e.target.value)}
                    />

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                        <CustomeButton
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </CustomeButton>
                        <CustomeButton
                            type="submit"
                            variant="default"
                            className="flex-1"
                            disabled={!formData.name.trim() || !formData.categoryId}
                        >
                            Add Item
                        </CustomeButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;