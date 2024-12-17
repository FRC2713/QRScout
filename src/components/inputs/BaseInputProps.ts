import { z } from 'zod';

export const inputTypeSchema = z
  .enum(['text', 'number', 'boolean', 'range', 'select', 'counter', 'timer'])
  .describe('The type of input');

export const inputBaseSchema = z.object({
  title: z.string().describe('The title of the input'),
  description: z.string().optional().describe('The description of the input'),
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
  defaultValue: z.unknown().optional().describe('The default value'),
  value: z.unknown().optional().describe('The value of the input'),
});

export const stringInputSchema = inputBaseSchema
  .extend({
    type: z.literal('text'),
    min: z.number().optional().describe('The minimum length of the string'),
    max: z.number().optional().describe('The maximum length of the string'),
    defaultValue: z.string().default('').describe('The default value'),
    value: z.string().optional().describe('The value of the input'),
  })
  .refine(data => data.value !== undefined || data.defaultValue !== undefined, {
    message: 'Either value or default must be defined',
    path: ['value'],
  })
  .transform(data => ({
    ...data,
    value: data.value ?? data.defaultValue,
  }));

export const numberInputSchema = inputBaseSchema
  .extend({
    type: z.literal('number'),
    min: z.number().optional().describe('The minimum value'),
    max: z.number().optional().describe('The maximum value'),
    defaultValue: z.number().default(0).describe('The default value'),
    value: z.number().optional().describe('The value of the input'),
    autoIncrementOnReset: z
      .boolean()
      .optional()
      .describe(
        'Whether this input should auto-increment on reset, instead of resetting to the default value',
      ),
  })
  .refine(data => data.value !== undefined || data.defaultValue !== undefined, {
    message: 'Either value or default must be defined',
    path: ['value'],
  })
  .transform(data => ({
    ...data,
    value: data.value ?? data.defaultValue,
  }));

export const selectInputSchema = inputBaseSchema
  .extend({
    type: z.literal('select'),
    choices: z.record(z.string()).optional().describe('The choices'),
    multiSelect: z
      .boolean()
      .optional()
      .describe('Whether multiple choices can be selected'),
    defaultValue: z
      .string()
      .describe('The default value. Must be one of the choices'),
    value: z.string().optional().describe('The value of the input'),
  })
  .refine(data => data.value !== undefined || data.defaultValue !== undefined, {
    message: 'Either value or default must be defined',
    path: ['value'],
  })
  .transform(data => ({
    ...data,
    value: data.value ?? data.defaultValue,
  }));

export const counterInputSchema = inputBaseSchema
  .extend({
    type: z.literal('counter'),
    min: z.number().optional().describe('The minimum value'),
    max: z.number().optional().describe('The maximum value'),
    step: z.number().optional().describe('The step value').default(1),
    defaultValue: z.number().default(0).describe('The default value'),
    value: z.number().optional().describe('The value of the input'),
    autoIncrementOnReset: z
      .boolean()
      .optional()
      .describe(
        'Whether this input should auto-increment on reset, instead of resetting to the default value',
      ),
  })
  .refine(data => data.value !== undefined || data.defaultValue !== undefined, {
    message: 'Either value or default must be defined',
    path: ['value'],
  })
  .transform(data => ({
    ...data,
    value: data.value ?? data.defaultValue,
  }));

export const rangeInputSchema = inputBaseSchema
  .extend({
    type: z.literal('range'),
    value: z.number().optional().describe('The value of the input'),
    min: z.number().optional().describe('The minimum value'),
    max: z.number().optional().describe('The maximum value'),
    step: z.number().optional().describe('The step value').default(1),
    defaultValue: z.number().optional().describe('The default value'),
    autoIncrementOnReset: z
      .boolean()
      .optional()
      .describe(
        'Whether this input should auto-increment on reset, instead of resetting to the default value',
      ),
  })
  .refine(data => data.value !== undefined || data.defaultValue !== undefined, {
    message: 'Either value or default must be defined',
    path: ['value'],
  })
  .transform(data => ({
    ...data,
    value: data.value ?? data.defaultValue,
  }));

export const booleanInputSchema = inputBaseSchema
  .extend({
    type: z.literal('boolean'),
    value: z.boolean().optional().describe('The value of the input'),
    defaultValue: z.boolean().optional().describe('The default value'),
  })
  .refine(data => data.value !== undefined || data.defaultValue !== undefined, {
    message: 'Either value or default must be defined',
    path: ['value'],
  })
  .transform(data => ({
    ...data,
    value: data.value ?? data.defaultValue,
  }));

export const timerInputSchema = inputBaseSchema
  .extend({
    type: z.literal('timer'),
    value: z.number().optional().describe('The value of the input').default(0),
    defaultValue: z.number().optional().describe('The default value'),
  })
  .refine(data => data.value !== undefined || data.defaultValue !== undefined, {
    message: 'Either value or default must be defined',
    path: ['value'],
  })
  .transform(data => ({
    ...data,
    value: data.value ?? data.defaultValue,
  }));

export const sectionSchema = z.object({
  name: z.string(),
  preserveDataOnReset: z.boolean().optional(),
  fields: z.array(
    z.union([
      counterInputSchema,
      stringInputSchema,
      numberInputSchema,
      selectInputSchema,
      rangeInputSchema,
      booleanInputSchema,
      timerInputSchema,
    ]),
  ),
});

export const configSchema = z.object({
  title: z
    .string()
    .describe(
      'The title of the scouting site. This will be displayed in the header and browser tab.',
    ),
  page_title: z.string().describe('The title of the page'),
  delimiter: z
    .string()
    .describe('The delimiter to use when joining the form data'),
  teamNumber: z
    .number()
    .describe('The team number of the team using this form.'),
  sections: z.array(sectionSchema),
});

export type InputTypes = z.infer<typeof inputTypeSchema>;

type BaseInputProps<T extends InputProps> = T & {
  section: string;
  onChange: (value: T['value']) => void;
};

export type InputProps = z.infer<typeof inputBaseSchema>;
type SelectInputPropsBase = z.infer<typeof selectInputSchema>;
type StringInputPropsBase = z.infer<typeof stringInputSchema>;
type NumberInputPropsBase = z.infer<typeof numberInputSchema>;
type CounterInputPropsBase = z.infer<typeof counterInputSchema>;
type RangeInputPropsBase = z.infer<typeof rangeInputSchema>;
type BooleanInputPropsBase = z.infer<typeof booleanInputSchema>;
type TimerInputPropsBase = z.infer<typeof timerInputSchema>;

export type SelectInputProps = BaseInputProps<SelectInputPropsBase>;
export type StringInputProps = BaseInputProps<StringInputPropsBase>;
export type NumberInputProps = BaseInputProps<NumberInputPropsBase>;
export type CounterInputProps = BaseInputProps<CounterInputPropsBase>;
export type RangeInputProps = BaseInputProps<RangeInputPropsBase>;
export type BooleanInputProps = BaseInputProps<BooleanInputPropsBase>;
export type TimerInputProps = BaseInputProps<TimerInputPropsBase>;

export type SectionProps = z.infer<typeof sectionSchema>;
export type Config = z.infer<typeof configSchema>;
