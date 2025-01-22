import styles from "../styles/RowForm.module.css";
import React from "react";
import {useFieldArray, useFormContext} from "react-hook-form";
import { FieldForm } from "./FieldForm";
import {FieldType, MetadataFormSchema} from "../metadataSchema";
import {v4 as uuidv4} from "uuid";
import {Button} from "@fluentui/react-components";
import {AddRegular} from "@fluentui/react-icons";
import {getWidthForSize} from "../helpers/utils";

interface RowFormProps {
    sectionIndex: number;
    rowIndex: number;
}

export const RowForm: React.FC<RowFormProps> = ({ sectionIndex, rowIndex}) => {

    const { control } = useFormContext<MetadataFormSchema>();
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: `sections.${sectionIndex}.rows.${rowIndex}.fields`,
    });

    const currentWidth = fields.reduce((acc: number, field: FieldType) => acc + getWidthForSize(field.size), 0);
    const availableWidth = 100 - currentWidth;

    const canAddField = fields.length < 3 && availableWidth >= 33.33;

    const addField = () => {
        if (!canAddField) return;
        const newField: FieldType = {
            id: uuidv4(),
            name: "",
            size: "small"
        }
        append(newField)
    };

    const handleDeleteField = (fieldIndex: number) => {
        remove(fieldIndex);
    };

    const handleChangeFieldSize = (fieldIndex: number, newSize: string) => {
        const field = fields[fieldIndex] as FieldType;
        const currentFieldWidth = getWidthForSize(field.size);
        const newFieldWidth = getWidthForSize(newSize);
        if ((availableWidth + currentFieldWidth) >= newFieldWidth) {
            update(fieldIndex,{ ...field, size: newSize } as FieldType);

        } else {
            alert("Not enough space to change the field size.");
        }
    };

    return (
        <div className={styles.stack}>
            <div className={styles.horizontalStack}>
                {
                    fields.map((field:FieldType, index: number) => (
                        <FieldForm
                            key={field.id}
                            fieldIndex={index}
                            availableWidth={availableWidth}
                            onDeleteField={handleDeleteField}
                            onChangeField={handleChangeFieldSize}
                            sectionIndex={sectionIndex}
                            rowIndex={rowIndex}
                        />
                        )
                    )
                }

                {
                    canAddField && (
                        <div
                            className={styles.plusRegion}
                            style={{ width: `${availableWidth}%`}}
                        >
                            <Button
                                appearance={"transparent"}
                                icon={<AddRegular />}
                                onClick={addField}
                                className={styles.button}
                            >
                                Add Column
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    );
};
