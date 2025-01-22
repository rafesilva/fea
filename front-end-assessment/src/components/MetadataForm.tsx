import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    Button,
    Dropdown,
    Checkbox,
} from '@fluentui/react-components';
import { MetadataFormSchema, metadataFormSchema } from './metadataSchema';
import { SectionAccordion } from './SectionAccordion';

interface MetadataFormProps {
    open: boolean;
    onClose: () => void;
    initialData?: MetadataFormSchema;
}

export const MetadataForm: React.FC<MetadataFormProps> = ({
                                                              open,
                                                              onClose,
                                                              initialData
                                                          }) => {

    const { register, handleSubmit, watch, control, formState, reset } =
        useForm<MetadataFormSchema>({
            resolver: zodResolver(metadataFormSchema),
            defaultValues: initialData,
        });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = (data: MetadataFormSchema) => {
        console.log("Form data: ", data);
        handleClose();
    };

    const viewTypeOptions = [
        { key: 'create', text: 'Create' },
        { key: 'edit', text: 'Edit' },
        { key: 'view', text: 'View' },
    ];

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogSurface style={{ width: '80vw', height: '80vh' }}>
                <DialogTitle>Metadata Form</DialogTitle>
                <DialogBody style={{ overflowY: 'auto', padding: '10px' }}>
                    <form onSubmit={handleSubmit(onSubmit)} style={{display: 'flex', flexDirection:'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <label style={{ display: 'block', fontWeight: 'bold' }}>View Type</label>
                            <Dropdown
                                {...register("viewType")}
                                options={viewTypeOptions}
                            />
                        </div>
                        <Checkbox
                            {...register("showSections")}
                            label="Show Sections"
                        />
                        <SectionAccordion control={control} sections={watch('sections')}/>
                        <DialogActions>
                            <Button appearance="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button appearance="primary" type="submit">
                                Submit
                            </Button>
                        </DialogActions>
                    </form>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};