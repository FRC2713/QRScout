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

export const tbaSchema = inputBaseSchema.extend({
  type: z.literal('tba'),
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

const shadcnColorSchema = z
  .string()
  .regex(/^(\d+(?:\.\d+)?)(?: (\d+(?:\.\d+)?)%)?(?: (\d+(?:\.\d+)?)%)?$/gm);

export const colorSchemeSchema = z.object({
  background: shadcnColorSchema,
  foreground: shadcnColorSchema,
  card: shadcnColorSchema,
  card_foreground: shadcnColorSchema,
  popover: shadcnColorSchema,
  popover_foreground: shadcnColorSchema,
  primary: shadcnColorSchema,
  primary_foreground: shadcnColorSchema,
  secondary: shadcnColorSchema,
  secondary_foreground: shadcnColorSchema,
  muted: shadcnColorSchema,
  muted_foreground: shadcnColorSchema,
  accent: shadcnColorSchema,
  accent_foreground: shadcnColorSchema,
  destructive: shadcnColorSchema,
  destructive_foreground: shadcnColorSchema,
  border: shadcnColorSchema,
  input: shadcnColorSchema,
  ring: shadcnColorSchema,
  chart_1: shadcnColorSchema,
  chart_2: shadcnColorSchema,
  chart_3: shadcnColorSchema,
  chart_4: shadcnColorSchema,
  chart_5: shadcnColorSchema,
});

export type ColorScheme = z.infer<typeof colorSchemeSchema>;

export const themeSchema = z.object({
  light: colorSchemeSchema,
  dark: colorSchemeSchema,
});

export type QRScoutTheme = z.infer<typeof themeSchema>;

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
  theme: themeSchema.default({
    light: {
      background: '0 0% 100%',
      foreground: '0 0% 3.9%',
      card: '0 0% 100%',
      card_foreground: '0 0% 3.9%',
      popover: '0 0% 100%',
      popover_foreground: '0 0% 3.9%',
      primary: '354.44 71.3% 47.9%',
      primary_foreground: '0 85.7% 97.3%',
      secondary: '0 0% 96.1%',
      secondary_foreground: '0 0% 9%',
      muted: '0 0% 96.1%',
      muted_foreground: '0 0% 45.1%',
      accent: '0 0% 96.1%',
      accent_foreground: '0 0% 9%',
      destructive: '0 84.2% 60.2%',
      destructive_foreground: '0 0% 98%',
      border: '0 0% 89.8%',
      input: '0 0% 89.8%',
      ring: '354.44 71.3% 47.9%',
      chart_1: '12 76% 61%',
      chart_2: '173 58% 39%',
      chart_3: '197 37% 24%',
      chart_4: '43 74% 66%',
      chart_5: '27 87% 67%',
    },
    dark: {
      background: '0 0% 3.9%',
      foreground: '0 0% 98%',
      card: '0 0% 3.9%',
      card_foreground: '0 0% 98%',
      popover: '0 0% 3.9%',
      popover_foreground: '0 0% 98%',
      primary: '354.44 71.3% 47.9%',
      primary_foreground: '0 85.7% 97.3%',
      secondary: '0 0% 14.9%',
      secondary_foreground: '0 0% 98%',
      muted: '0 0% 14.9%',
      muted_foreground: '0 0% 63.9%',
      accent: '0 0% 14.9%',
      accent_foreground: '0 0% 98%',
      destructive: '0 62.8% 30.6%',
      destructive_foreground: '0 0% 98%',
      border: '0 0% 14.9%',
      input: '0 0% 14.9%',
      ring: '354.44 71.3% 47.9%',
      chart_1: '220 70% 50%',
      chart_2: '160 60% 45%',
      chart_3: '30 80% 55%',
      chart_4: '280 65% 60%',
      chart_5: '340 75% 55%',
    },
  }),
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
