import React, { useMemo } from 'react';
import { Dropdown, Stack } from '@fluentui/react-components';
import { useController, Control } from 'react-hook-form';
import { SearchBox } from '@fluentui/react-components';

interface FieldFormProps {
    sectionIndex: number;
    rowIndex: number;
    fieldIndex: number;
    control: Control<any>;
    availableWidth: number;
}

export const FieldForm: React.FC<FieldFormProps> = ({
                                                        sectionIndex,
                                                        rowIndex,
                                                        fieldIndex,
                                                        control,
                                                        availableWidth
                                                    }) => {
    const { field } = useController({
        name: `sections.${sectionIndex}.rows.${rowIndex}.fields.${fieldIndex}.name`,
        control,
    });

    const { field: fieldSize } = useController({
        name: `sections.${sectionIndex}.rows.${rowIndex}.fields.${fieldIndex}.size`,
        control,
    });
    const sizeOptions = useMemo(() => {
        const options = [
            { key: 'small', text: 'Small (33%)' },
            { key: 'medium', text: 'Medium (50%)' },
            { key: 'large', text: 'Large (66%)' },
            { key: 'extra-large', text: 'Extra-large (100%)' },
        ]
        if(availableWidth === 100){
            return  options.filter(o => o.key === fieldSize.value)
        }

        if(availableWidth > 100){
            return  options.filter(o => o.key === fieldSize.value)
        }
        return options;
    }, [availableWidth, fieldSize.value]);


    const fieldOptions = [
        { key: "textField", text: "Text Field" },
        { key: "selectField", text: "Select Field" },
        { key: "dateField", text: "Date Field" },
    ];


    const selectFieldWidth = useMemo(() => {
        if (fieldSize.value === "small") {
            return "33%"
        }

        if (fieldSize.value === "medium") {
            return "50%"
        }
        if (fieldSize.value === "large") {
            return "66%"
        }
        return "100%";
    }, [fieldSize.value]);


    return (
        <Stack style={{ minWidth: selectFieldWidth, maxWidth: selectFieldWidth}} >
            <Dropdown
                label="Field Type"
                options={fieldOptions}
                selectedKey={field.value}
                onOptionSelect={(_, option) => field.onChange(option?.key)}
            />
            <Dropdown
                label="Field Size"
                options={sizeOptions}
                selectedKey={fieldSize.value}
                onOptionSelect={(_, option) => fieldSize.onChange(option?.key)}
                disabled={availableWidth >= 100}
            />
        </Stack>
    );
};