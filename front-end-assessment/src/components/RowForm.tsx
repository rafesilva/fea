import React, { useMemo } from 'react';
import { Button, Stack } from '@fluentui/react-components';
import { useFieldArray, Control } from 'react-hook-form';
import { Field } from './metadataSchema';
import { FieldForm } from './FieldForm';
import { Trash20Regular } from "@fluentui/react-icons";
import { v4 as uuidv4 } from 'uuid';
import { IconButton } from '@fluentui/react-components';


interface RowFormProps {
    sectionIndex: number;
    rowIndex: number;
    control: Control<any>;
}

export const RowForm: React.FC<RowFormProps> = ({
                                                    sectionIndex,
                                                    rowIndex,
                                                    control
                                                }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `sections.${sectionIndex}.rows.${rowIndex}.fields`,
    });

    const availableWidth = useMemo(() => {
        if(fields){
            const currentWidth = fields.reduce((acc, curr) => {
                if(curr.size === "small"){
                    return acc + 33.33
                }
                if(curr.size === "medium"){
                    return acc + 50
                }
                if(curr.size === "large"){
                    return acc + 66.66
                }
                return acc + 100;
            }, 0);
            return currentWidth
        }
        return 0
    }, [fields])

    const addField = () => {
        append({
            id: uuidv4(),
            name: "",
            size: "small"
        })
    }
    const handleRemove = (index: number) => {
        remove(index)
    };

    return (
        <Stack tokens={{ childrenGap: 10 }}>
            <Stack horizontal tokens={{childrenGap: '1rem'}}>
                {fields?.map((field, index) => (
                    <FieldForm
                        key={field.id}
                        control={control}
                        sectionIndex={sectionIndex}
                        rowIndex={rowIndex}
                        fieldIndex={index}
                        availableWidth={availableWidth}
                    />
                ))}
            </Stack>
            <Stack horizontal tokens={{childrenGap: '1rem'}}>
                <Button onClick={addField}>Add Field</Button>
                {fields?.length > 1 && <IconButton icon={<Trash20Regular />} onClick={() => remove()} aria-label="delete row"/>}
            </Stack>
        </Stack>
    );
};