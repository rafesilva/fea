import React, { useEffect } from 'react';
import { TextField, Button, Stack } from '@fluentui/react-components';
import { useFieldArray, Control } from 'react-hook-form';
import { Row } from './metadataSchema';
import { RowForm } from './RowForm';
import { v4 as uuidv4 } from 'uuid';


interface SectionFormProps {
    sectionIndex: number;
    control: Control<any>;
}

export const SectionForm: React.FC<SectionFormProps> = ({
                                                            sectionIndex,
                                                            control,
                                                        }) => {
    const { fields, append } = useFieldArray({
        control,
        name: `sections.${sectionIndex}.rows`,
    });

    const addRow = () => {
        append({
            id: uuidv4(),
            fields: [
                {
                    id: uuidv4(),
                    name: "",
                    size: "small",
                },
                {
                    id: uuidv4(),
                    name: "",
                    size: "small",
                },
                {
                    id: uuidv4(),
                    name: "",
                    size: "small",
                }
            ],
        });
    };

    return (
        <Stack tokens={{childrenGap: 10}}>
            <TextField
                label="Section Label"
                {...control.register(`sections.${sectionIndex}.label`, {
                    required: "Section Label is required"
                })}
            />
            <Button onClick={addRow}>Add Row</Button>
            {fields?.map((field, index) => (
                <RowForm
                    key={field.id}
                    control={control}
                    sectionIndex={sectionIndex}
                    rowIndex={index}
                />
            ))}
        </Stack>
    );
};