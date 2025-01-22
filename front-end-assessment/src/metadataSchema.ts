import * as z from 'zod';

export const FieldSchema = z.object({
    id: z.string(), // ID as a string
    name: z.string().nonempty({ message: "Field is required" }),
    size: z.enum(["small", "medium", "large", "extra-large"]),
});

export type FieldType = z.infer<typeof FieldSchema>;

export const rowSchema = z.object({
    id: z.string(),
    fields: z.array(FieldSchema),
});

export type Row = z.infer<typeof rowSchema>

export const SectionSchema = z.object({
    id: z.string(),
    label: z.string().nonempty({ message: "Field is required" }),
    rows: z.array(rowSchema)
});

export type Section = z.infer<typeof SectionSchema>

export const metadataFormSchema = z.object({
    viewType: z.enum(['create', 'edit', 'view'], { required_error: "View type is required" }),
    showSections: z.boolean(),
    sections: z.array(SectionSchema).optional(),
    label: z.string().optional(),
});

export type MetadataFormSchema = z.infer<typeof metadataFormSchema>;

