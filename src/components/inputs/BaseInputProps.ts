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
  defaultValue: z.unknown().describe('The default value'),
});

export const stringInputSchema = inputBaseSchema.extend({
  type: z.literal('text'),
  min: z.number().optional().describe('The minimum length of the string'),
  max: z.number().optional().describe('The maximum length of the string'),
  defaultValue: z.string().default('').describe('The default value'),
});

export const numberInputSchema = inputBaseSchema.extend({
  type: z.literal('number'),
  min: z.number().optional().describe('The minimum value'),
  max: z.number().optional().describe('The maximum value'),
  defaultValue: z.number().default(0).describe('The default value'),
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
  multiSelect: z
    .boolean()
    .optional()
    .describe('Whether multiple choices can be selected'),
  defaultValue: z
    .string()
    .default('')
    .describe('The default value. Must be one of the choices'),
});

export const counterInputSchema = inputBaseSchema.extend({
  type: z.literal('counter'),
  min: z.number().optional().describe('The minimum value'),
  max: z.number().optional().describe('The maximum value'),
  step: z.number().optional().describe('The step value').default(1),
  defaultValue: z.number().default(0).describe('The default value'),
  autoIncrementOnReset: z
    .boolean()
    .optional()
    .describe(
      'Whether this input should auto-increment on reset, instead of resetting to the default value',
    ),
});

export const rangeInputSchema = inputBaseSchema.extend({
  type: z.literal('range'),
  min: z.number().optional().describe('The minimum value'),
  max: z.number().optional().describe('The maximum value'),
  step: z.number().optional().describe('The step value').default(1),
  defaultValue: z.number().default(0).describe('The default value'),
  autoIncrementOnReset: z
    .boolean()
    .optional()
    .describe(
      'Whether this input should auto-increment on reset, instead of resetting to the default value',
    ),
});

export const booleanInputSchema = inputBaseSchema.extend({
  type: z.literal('boolean'),
  defaultValue: z.boolean().default(false).describe('The default value'),
});

export const timerInputSchema = inputBaseSchema.extend({
  type: z.literal('timer'),
  defaultValue: z.number().default(0).describe('The default value'),
});

export const sectionSchema = z.object({
  name: z.string(),
  preserveDataOnReset: z.boolean().optional(),
  fields: z.array(
    z.discriminatedUnion('type', [
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

const shadcnColorSchema = z.string().regex(/\d+\s+\d+%\s+\d+%/);

export const colorSchemeSchema = z.object({
  background: shadcnColorSchema.default('0 0% 100%'),
  foreground: shadcnColorSchema.default('0 0% 3.9%'),
  card: shadcnColorSchema.default('0 0% 100%'),
  card_foreground: shadcnColorSchema.default('0 0% 3.9%'),
  popover: shadcnColorSchema.default('0 0% 100%'),
  popover_foreground: shadcnColorSchema.default('0 0% 3.9%'),
  primary: shadcnColorSchema.default('354.44 71.3% 47.9%'),
  primary_foreground: shadcnColorSchema.default('0 85.7% 97.3%'),
  secondary: shadcnColorSchema.default('0 0% 96.1%'),
  secondary_foreground: shadcnColorSchema.default('0 0% 9%'),
  muted: shadcnColorSchema.default('0 0% 96.1%'),
  muted_foreground: shadcnColorSchema.default('0 0% 45.1%'),
  accent: shadcnColorSchema.default('0 0% 96.1%'),
  accent_foreground: shadcnColorSchema.default('0 0% 9%'),
  destructive: shadcnColorSchema.default('0 84.2% 60.2%'),
  destructive_foreground: shadcnColorSchema.default('0 0% 98%'),
  border: shadcnColorSchema.default('0 0% 89.8%'),
  input: shadcnColorSchema.default('0 0% 89.8%'),
  ring: shadcnColorSchema.default('354.44 71.3% 47.9%'),
  chart_1: shadcnColorSchema.default('12 76% 61%'),
  chart_2: shadcnColorSchema.default('173 58% 39%'),
  chart_3: shadcnColorSchema.default('197 37% 24%'),
  chart_4: shadcnColorSchema.default('43 74% 66%'),
  chart_5: shadcnColorSchema.default('27 87% 67%'),
});

export const themeSchema = z.object({
  light: colorSchemeSchema,
  dark: colorSchemeSchema,
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
  theme: themeSchema.optional(),
  sections: z.array(sectionSchema),
});

export type InputTypes = z.infer<typeof inputTypeSchema>;

export type InputBase = z.infer<typeof inputBaseSchema>;
export type SelectInputData = z.infer<typeof selectInputSchema>;
export type StringInputData = z.infer<typeof stringInputSchema>;
export type NumberInputData = z.infer<typeof numberInputSchema>;
export type CounterInputData = z.infer<typeof counterInputSchema>;
export type RangeInputData = z.infer<typeof rangeInputSchema>;
export type BooleanInputData = z.infer<typeof booleanInputSchema>;
export type TimerInputData = z.infer<typeof timerInputSchema>;

export type InputPropsMap = {
  text: StringInputData;
  number: NumberInputData;
  boolean: BooleanInputData;
  range: RangeInputData;
  select: SelectInputData;
  counter: CounterInputData;
  timer: TimerInputData;
};

export type SectionProps = z.infer<typeof sectionSchema>;
export type Config = z.infer<typeof configSchema>;
