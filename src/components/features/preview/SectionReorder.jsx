import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GripVertical, ArrowUpDown } from 'lucide-react';
import useResumeStore from '../../../store/useResumeStore';

const SECTION_LABELS = {
    summary: 'Professional Summary',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    certifications: 'Certifications',
};

const SortableItem = ({ id }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.85 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border bg-white transition-shadow ${isDragging
                    ? 'shadow-lg border-blue-400 ring-2 ring-blue-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none"
                tabIndex={-1}
            >
                <GripVertical size={16} />
            </button>
            <span className="text-sm font-medium text-gray-700 select-none">
                {SECTION_LABELS[id] || id}
            </span>
        </div>
    );
};

const SectionReorder = () => {
    const { resumeData, updateSectionOrder } = useResumeStore();
    const sectionOrder = resumeData.sectionOrder || ['summary', 'experience', 'education', 'skills', 'certifications'];
    const [isOpen, setIsOpen] = React.useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sectionOrder.indexOf(active.id);
        const newIndex = sectionOrder.indexOf(over.id);
        const newOrder = [...sectionOrder];
        newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, active.id);
        updateSectionOrder(newOrder);
    };

    return (
        <div className="mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
            >
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <ArrowUpDown size={15} />
                    Reorder Sections
                </span>
                <span className="text-xs text-gray-400">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-[11px] text-gray-400 mb-2">Drag to reorder resume sections</p>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                            <div className="flex flex-col gap-1.5">
                                {sectionOrder.map((id) => (
                                    <SortableItem key={id} id={id} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            )}
        </div>
    );
};

export default SectionReorder;
