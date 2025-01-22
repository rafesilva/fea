import styles from "../styles/SectionList.module.css";
import {useFieldArray, useFormContext} from "react-hook-form";
import { Section, MetadataFormSchema } from "../metadataSchema";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import {Button, Tooltip} from "@fluentui/react-components";
import { Delete20Regular } from "@fluentui/react-icons";


export const SectionList: React.FC = () => {

    const [visible, setVisible] = React.useState(false);
    const [toolTipText, setToolTipText] = React.useState<string>("");

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

    const handleRemoveSection = (e:any, index: number) => {
        e.stopPropagation();
        remove(index);
    };

    return (
        <div className={styles.sectionsList}>
            {
                fields.map((field, index) => (
                    <Tooltip
                        withArrow
                        content={toolTipText}
                        relationship="label"
                    >
                        <div key={field.id} className={styles.sectionItem}>
                            <input className={styles.input}
                                {...control.register(`sections.${index}.label`, {
                                        required: "Section Label is required",
                                    })
                                }
                                onChange={(e)=>setToolTipText(e.target.value)}
                                onFocus={()=>setVisible(true)}
                            />
                            {
                                index > 0 && <Button className={styles.deleteButton} appearance={'transparent'}
                                     icon={<Delete20Regular className={styles.deleteButtonIcon} color={'white'}/>}
                                     onClick={(e) => handleRemoveSection(e, index)}></Button>
                            }
                        </div>
                    </Tooltip>
                    )
                )
            }
            <Button appearance={"secondary"} className={styles.button} onClick={handleAddSection}>+ Add Section</Button>
        </div>
    );
};
