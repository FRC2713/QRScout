import { zodToJsonSchema } from 'zod-to-json-schema';
import { configSchema } from '../components/inputs/BaseInputProps';

const schema = zodToJsonSchema(configSchema);

console.log(JSON.stringify(schema, null, 2));
