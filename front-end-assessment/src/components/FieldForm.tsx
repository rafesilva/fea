import styles from "../styles/FieldForm.module.css";

import React, {useMemo, useState} from "react";
import {
    Menu,
    MenuTrigger,
    MenuPopover,
    MenuList,
    MenuItem,
    SplitButton,
    Field,
    Combobox,
    OptionGroup,
    MenuButtonProps,
    MenuItemRadio,
} from "@fluentui/react-components";

import { Option } from '@fluentui/react-components';

import {
    BoxEditRegular,
    CalendarEditRegular, DeleteRegular,
    LayoutColumnFourFocusCenterLeftFilled,
    MoreHorizontal24Regular
} from "@fluentui/react-icons";
import { useController, useFormContext, useWatch } from "react-hook-form";
import {FieldType, FieldSchema, MetadataFormSchema} from "../metadataSchema";
import {useId} from "@fluentui/react-hooks";
import type { ComboboxProps } from "@fluentui/react-components";
import {getWidthForSize} from "../helpers/utils";


const FIELD_OPTIONS = [
    { children: "title", value: "Title" },
    { children: "summaryForChanges", value: "Summary for changes" },
    { children: "reasonForChanges", value: "Reason for changes" },
    { children: "preApprovedDoc", value: "Pre-approved document?" },
    { children: "followUpComment", value: "Follow Up Comment" },
    { children: "checkInComment", value: "Check In Comment" },
];

const SIZE_OPTIONS = [
    { key: "small", label: "Small", width: 33.33 },
    { key: "medium", label: "Medium", width: 50 },
    { key: "large", label: "Large", width: 66.66 },
    { key: "extra-large", label: "Extra Large", width: 100 },
];

interface FieldFormProps {
    availableWidth: number;
    onDeleteField: (fieldIndex: number) => void;
    onChangeField: (fieldIndex: number, newSize: string) => void;
    sectionIndex: number;
    rowIndex: number;
    fieldIndex: number;
}

import type { MenuProps } from "@fluentui/react-components";


interface ControllingOPenAndClose {
    alreadySelected: string[];
    onSelectItem: (item:string) => void;
}


export const FieldForm: React.FC<FieldFormProps> = ({
                                                        availableWidth,
                                                        fieldIndex,
                                                        onDeleteField,
                                                        onChangeField,
                                                        sectionIndex,
                                                        rowIndex,
                                                    }) => {

    const { control, formState } = useFormContext<MetadataFormSchema>();
    const { errors } = formState;
    const [ checkedValues, setCheckedValues ] = useState<Record<string, string[]>>({ size: ["small"]});

    // noinspection TypeScriptValidateTypes
    const rows = useWatch({
        control,
        name: `sections.${sectionIndex}.rows`,
        defaultValue: [],
    });

    const alreadySelectedItems = useMemo(() => rows
            .flatMap((row) => row.fields)
            .map((field) => field.name)
        , [rows])

    const alreadySelectedSizes = useMemo(() => rows
            .flatMap((row) => row.fields)
            .map((field) => field.size).filter((size, sIx)=>sIx === fieldIndex)
        , [rows, fieldIndex]);

    const onChangeItem: MenuProps["onCheckedValueChange"] = (e, { name, checkedItems }) => {
        onChangeField(fieldIndex, checkedItems[0])
        setCheckedValues((s) => ({ ...s, [name]: alreadySelectedSizes }));
    };

    // noinspection TypeScriptValidateTypes
    const {
        field: { value = {}, onChange },
    } = useController({
        name: `sections.${sectionIndex}.rows.${rowIndex}.fields.${fieldIndex}`,
        control,
        rules: {
            validate: (fieldValue) => FieldSchema.safeParse(fieldValue).success || "Invalid field data",
        },
    });

    const field = value as FieldType;

    const handleItemSelect = (itemLabel: string) => {
        onChange({ ...field, name: itemLabel });
    };

    const SizesSubMenu = () => {
        return (
            <Menu>
                <MenuTrigger disableButtonEnhancement>
                    <MenuItem icon={<LayoutColumnFourFocusCenterLeftFilled color={'#093870'} />}>Field Width</MenuItem>
                </MenuTrigger>

                <MenuPopover>
                    <MenuList checkedValues={{size: alreadySelectedSizes }} onCheckedValueChange={onChangeItem}>
                    {
                        SIZE_OPTIONS.map((sizeOption) => (
                                <MenuItemRadio
                                    key={sizeOption.key}
                                    name={"size"}
                                    className={styles.radio}
                                    disabled={
                                        availableWidth + getWidthForSize(field.size) <
                                        getWidthForSize(sizeOption.key)
                                    }
                                    value={sizeOption.key}
                                >
                                    {sizeOption.label}
                                </MenuItemRadio>
                            )
                        )
                    }
                    </MenuList>
                </MenuPopover>
            </Menu>
        );
    };

    return (
        <div
            className={styles.fieldContainer}
            style={{ minWidth: `${getWidthForSize(field.size)-1.25}%`, maxWidth: `${getWidthForSize(field.size)-1.25}%` }}
        >
            <Field className={styles.field} validationMessage={
                errors?.sections?.[sectionIndex]?.rows?.[rowIndex]?.fields?.[fieldIndex]?.name && (
                    errors.sections[sectionIndex].rows[rowIndex].fields[fieldIndex].name.message)
                }
            >
                <Menu positioning="below-end">
                    <MenuTrigger>
                        {
                            (triggerProps: MenuButtonProps) => (
                                <SplitButton appearance={"transparent"} primaryActionButton={{style: {width:'100%', padding:0, border:0}}}
                                             menuButton={{
                                                 style: { position:'absolute', backgroundColor:'transparent', right:0 },
                                                 ...triggerProps
                                             }}
                                             menuIcon={<MoreHorizontal24Regular className={styles.icon} />}
                                             className={styles.splitButton}
                                    >
                                    <ControllingOpenAndClose alreadySelected={alreadySelectedItems} onSelectItem={handleItemSelect} />
                                </SplitButton>
                            )
                        }
                    </MenuTrigger>
                    <MenuPopover className={styles.menuPopover}>
                        <MenuList>
                            <MenuItem icon={<BoxEditRegular color={'#093870'}/>} disabled>Set Layout Rules</MenuItem>
                            <SizesSubMenu />
                            <MenuItem icon={<CalendarEditRegular color={'#093870'}/>} onClick={() => alert("Function Disabled")}>Edit Field</MenuItem>
                            <MenuItem icon={<DeleteRegular color={'red'}/>} onClick={() => onDeleteField(fieldIndex)}>Delete</MenuItem>
                        </MenuList>
                    </MenuPopover>
                </Menu>
            </Field>
        </div>
    );
};


export const ControllingOpenAndClose: React.FC<ControllingOPenAndClose> = ({alreadySelected, onSelectItem}) => {

    const comboId = useId("combo-default");
    const [open, setOpen] = React.useState(false);
    const [filterText, setFilterText] = useState<string>("");

    const handleOpenChange: ComboboxProps["onOpenChange"] = (e, data) => {
        // setFilterText("");
        setOpen(data.open);
    }

    const onOptionSelect: ComboboxProps["onOptionSelect"] = (e, data) => {
        setFilterText(data.optionText ?? "");
        onSelectItem(data.optionText ?? "")
    };

    return (
        <div className={styles.fieldWrapper}>
            {
                filterText.trim() !== "" && <div className={styles.fieldIcon}>||</div>
            }
            <Combobox
                aria-labelledby={comboId}
                open={open}
                placeholder={!open ? "+ Add Input" : ""}
                onOpenChange={handleOpenChange}
                onOptionSelect={onOptionSelect}
                onChange={(ev) => setFilterText(ev.target.value)}
                expandIcon={null}
                appearance={"filled-darker"}
                className={styles.fieldInput}
                style={{ paddingLeft:filterText.trim() !== "" ? '.75rem' : 0 }}
                value={filterText}
            >
                <OptionGroup label={"Select Field"}>
                    {
                        FIELD_OPTIONS.filter(option=>option.value.includes(filterText)).map((option) => (
                            <Option checkIcon={null} key={option.children} disabled={alreadySelected.includes(option.value)}>
                                {option.value}
                            </Option>
                            )
                        )
                    }
                </OptionGroup>
            </Combobox>
        </div>
    );
};
