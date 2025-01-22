import styles from "../styles/MetadataForm.module.css";
import React, {useMemo} from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Dropdown, Option, Checkbox, Button, Label, Input, Field, Tooltip} from "@fluentui/react-components";
import { metadataFormSchema, MetadataFormSchema } from "../metadataSchema";
import { SectionsList } from "./SectionsList";
import { SectionForm } from "./SectionForm";
import { v4 as uuidv4 } from "uuid";
import { Search12Regular } from "@fluentui/react-icons";
import {capitalizeFirstLetter} from "../helpers/utils";


const VIEW_TYPE_OPTIONS = [
    { key: "create", text: "Create" },
    { key: "edit", text: "Edit" },
    { key: "view", text: "View" },
];

export const MetadataForm: React.FC = () => {

    const methods = useForm<MetadataFormSchema>({
        resolver: zodResolver(metadataFormSchema),
        defaultValues: {
            viewType: "create",
            showSections: false,
            sections: [
                {
                    id: uuidv4(),
                    label: "",
                    rows: [
                        {
                            id: uuidv4(),
                            fields: [
                                { id: uuidv4(), name: "", size: "small" },
                                { id: uuidv4(), name: "", size: "small" },
                                { id: uuidv4(), name: "", size: "small" }
                            ]
                        }
                    ],
                },
            ],
        },
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
    } = methods

    const showSections = watch("showSections");
    const viewType = watch("viewType");

    const onSubmit = (data: MetadataFormSchema) => {
        console.log("Submitted Form Data:", data);
    };

    const dropdownOptions = useMemo(() => {
        return VIEW_TYPE_OPTIONS.map((opt) => (
                <Option key={opt.key} value={opt.key}>
                    {opt.text}
                </Option>
            )
        )
    }, []);

    return (
        <FormProvider {...methods}>

            <div className={styles.metadataContainer}>
                <div className={styles.formContainer}>
                    <div className={styles.topHeader}>
                        <Field className={styles.label} label="Label" required>
                            <Input className={styles.input} type={'text'}/>
                        </Field>
                        <Field className={styles.label} label="View Type">
                            <Dropdown
                                className={styles.input}
                                expandIcon={<Search12Regular />}
                                placeholder="Select a View Type"
                                value={capitalizeFirstLetter(viewType)}
                                onOptionSelect={(_, option) => {
                                    if (
                                        option?.optionValue === "create" ||
                                        option?.optionValue === "edit" ||
                                        option?.optionValue === "view"
                                    ) {
                                        setValue("viewType", option.optionValue);
                                    }
                                }}
                            >
                                {dropdownOptions}

                            </Dropdown>
                        </Field>
                    </div>

                    <div className={styles.showSections}>
                        <Tooltip
                            withArrow
                            content={"Unselect this option will temporally remove all the sections from 2st"}
                            relationship="label"
                        >
                            <Checkbox className={styles.checkbox} label="Show Sections" {...register("showSections")} />
                        </Tooltip>
                    </div>

                    <div className={styles.mainContent}>
                        { showSections && <SectionsList /> }
                        <SectionForm />
                    </div>
                    <Button className={styles.submitButton} appearance="primary" size={"large"} onClick={handleSubmit(onSubmit)}>
                        Save Design
                    </Button>

                </div>
            </div>
        </FormProvider>
    );
};