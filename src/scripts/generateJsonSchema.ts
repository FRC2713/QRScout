import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { configSchema } from '../components/inputs/BaseInputProps';

const schemaSchema = configSchema.extend({
  $schema: z.string().optional(),
});

const schema = zodToJsonSchema(schemaSchema);

console.log(JSON.stringify(schema, null, 2));
