import styles from "../styles/SectionForm.module.css";
import React from "react";
import {Accordion, AccordionHeader, AccordionItem, AccordionPanel, Label} from "@fluentui/react-components";

import { useFieldArray, useFormContext } from "react-hook-form";
import { RowForm } from "./RowForm";
import { v4 as uuidv4 } from 'uuid';
import { MetadataFormSchema, Row } from "../metadataSchema";
import { Button } from "@fluentui/react-components";

interface SectionRowsFormProps {
    sectionIndex: number;
}

export const SectionRowsForm: React.FC<SectionRowsFormProps> = ({ sectionIndex }) => {

    const { control } = useFormContext();

    const { fields, append } = useFieldArray({
        control,
        name: `sections.${sectionIndex}.rows`,
    });

    const addRow = (e:any) => {
        e.stopPropagation()
        const newRow: Row = {
            id: uuidv4(),
            fields: [
                { id: uuidv4(), name: "", size: "small" },
                { id: uuidv4(), name: "", size: "small" },
                { id: uuidv4(), name: "", size: "small" }
            ],
        };
        append(newRow);
    };

    return (
        <div className={styles.stack}>
            {
                fields.map((field, rowIndex) => (
                        <RowForm key={field.id} sectionIndex={sectionIndex} rowIndex={rowIndex} />
                    )
                )
            }
            <Button appearance={"transparent"} onClick={addRow} className={styles.addRow}>
                + Add Row
            </Button>
        </div>
    );
};



export const SectionForm: React.FC = () => {

    const { watch } = useFormContext<MetadataFormSchema>();

    const sections = watch("sections");

    return <div className={styles.sectionsForm}>
        {
            sections && sections.length > 0 ? (
            sections.map((section, idx) => (
                <Accordion key={idx} collapsible multiple defaultOpenItems={[section.id]}>
                    <AccordionItem key={section.id} value={section.id}>
                        <AccordionHeader className={styles.sectionHeader} expandIconPosition={'end'}>
                            <Label className={styles.sectionLabel} style={{
                                opacity: section.label ? 1 : .33,
                                fontWeight: section.label ? 'bold' : 'normal'
                            }}>
                                {section.label || "Section Name"}
                            </Label>
                        </AccordionHeader>
                        <AccordionPanel className={styles.panel}>
                            <SectionRowsForm sectionIndex={idx}/>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                )
            )) : (
                <p style={{fontStyle: "italic"}}>
                    No sections. Please add a section on the left.
                </p>
            )
        }
    </div>
};

