import styles from "../styles/SectionList.module.css";
import {useController, useFieldArray, useFormContext, useWatch} from "react-hook-form";
import {Section, MetadataFormSchema, SectionSchema} from "../metadataSchema";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import {Button, Field, Tooltip} from "@fluentui/react-components";
import { Delete20Regular } from "@fluentui/react-icons";


const SectionItem: React.FC<{ field:Section, index:number, onRemoveSection: ( index:number)=>void }> = ({field, index, onRemoveSection}) => {

    const [visible, setVisible] = React.useState(false);
    const [toolTipText, setToolTipText] = React.useState<string>("");

    const { control, formState } = useFormContext<MetadataFormSchema>();
    const { errors } = formState;

    // noinspection TypeScriptValidateTypes
    const {
        field: { value = {}, onChange },
    } = useController({
        name: `sections.${index}`,
        control,
        rules: {
            validate: (fieldValue) => SectionSchema.safeParse(fieldValue).success || "Invalid section data",
        },
    });

    return (

            <Field
                validationMessage={
                    errors?.sections?.[index]?.label && (
                        errors.sections[index].label.message)                }
            >
                <Tooltip
                    withArrow
                    content={toolTipText || "Fill section label"}
                    relationship="label"
                >
                    <div className={styles.sectionItem}>
                        <input
                            className={styles.input}
                               onChange={(e)=> {
                                   e.stopPropagation()
                                   setToolTipText(e.target.value)
                                   onChange({...value, label:e.target.value})
                               }}
                               onFocus={()=>setVisible(true)}
                        />
                        {
                            index > 0 && <Button className={styles.deleteButton} appearance={'transparent'}
                                                 icon={<Delete20Regular className={styles.deleteButtonIcon} color={'white'}/>}
                                                 onClick={() => onRemoveSection(index)}></Button>
                        }
                    </div>
                </Tooltip>

            </Field>

    );
};

export const SectionsList: React.FC = () => {

    const { control } = useFormContext<MetadataFormSchema>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "sections",
    });

    const handleAddSection = () => {
        const newSection: Section = {
            id: uuidv4(),
            label: "",
            rows: [],
        }
        append(newSection);
    };

    const handleRemoveSection = (index: number) => {
        remove(index);
    };

    return (
        <div className={styles.sectionsList}>
            {
                fields.map((field, index) => (
                        <SectionItem key={field.id} field={field} index={index} onRemoveSection={handleRemoveSection}/>
                    )
                )
            }
            <Button appearance={"secondary"} className={styles.button} onClick={handleAddSection}>+ Add Section</Button>
        </div>
    );
};
