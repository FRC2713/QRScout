import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { configSchema } from '../components/inputs/BaseInputProps.ts';

// Get the output file path from command line arguments
const outputFilePath = process.argv[2];

if (!outputFilePath) {
  console.error('Error: Please provide an output file path as an argument.');
  console.error('Usage: ts-node generateJsonSchema.ts <output-file-path>');
  process.exit(1);
}

// Resolve the output path relative to the current directory if it's not absolute
const resolvedOutputPath = path.isAbsolute(outputFilePath)
  ? outputFilePath
  : path.resolve(process.cwd(), outputFilePath);

const schemaSchema = configSchema.extend({
  $schema: z.string().optional(),
});

const schema = zodToJsonSchema(schemaSchema);

// Ensure the directory exists
const directory = path.dirname(resolvedOutputPath);
if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
}

// Write the schema to the specified file
try {
  fs.writeFileSync(resolvedOutputPath, JSON.stringify(schema, null, 2));
  console.log(`JSON schema successfully written to ${resolvedOutputPath}`);
} catch (error) {
  console.error(
    `Error writing to file: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exit(1);
}
