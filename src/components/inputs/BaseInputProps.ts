import { z } from 'zod';
export default interface BaseInputProps extends InputProps {
  section: string;
  onChange: (value: any) => void;
}

export const inputTypeSchema = z
  .enum(['text', 'number', 'boolean', 'range', 'select', 'counter', 'timer'])
  .describe('The type of input');

export const inputBaseSchema = z.object({
  title: z.string().describe('The title of the input'),
  type: inputTypeSchema,
  required: z.boolean().describe('Whether this input is required'),
  code: z.string().describe('A unique code for this input'),
  disabled: z.boolean().optional().describe('Whether this input is disabled'),
  preserveDataOnReset: z
    .boolean()
    .optional()
    .describe(
      'Whether this input should be preserved when the scouting form is reset',
    ),
  value: z.any().optional().describe('The current value of the input'),
  defaultValue: z
    .any()
    .optional()
    .describe(
      'The default value of the input.  The value will be reset to this when the scouting form is reset.  If not provided, the value will be reset to something sensible based on the type of input.',
    ),
  choices: z
    .record(z.string())
    .optional()
    .describe('The choices for a select input'),
  min: z.number().optional().describe('The minimum value for a number input'),
  max: z.number().optional().describe('The maximum value for a number input'),
  autoIncrementOnReset: z
    .boolean()
    .optional()
    .describe(
      'Whether this input should auto-increment on reset, instead of resetting to the default value',
    ),
});

export const selectInputSchema = inputBaseSchema.extend({
  type: z.literal('select'),
  choices: z.record(z.string()).optional().describe('The choices'),
});

export const sectionSchema = z.object({
  name: z.string(),
  preserveDataOnReset: z.boolean().optional(),
  fields: z.array(inputBaseSchema),
});

export const configSchema = z.object({
  title: z.string(),
  page_title: z.string(),
  delimiter: z.string(),
  sections: z.array(sectionSchema),
});

export type InputTypes = z.infer<typeof inputTypeSchema>;

export type InputProps = z.infer<typeof inputBaseSchema>;
export type SelectInputProps = z.infer<typeof selectInputSchema>;

export type SectionProps = z.infer<typeof sectionSchema>;
export type Config = z.infer<typeof configSchema>;
