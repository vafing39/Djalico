import { defineConfig } from 'vitest/config';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function parseEnvFile(filePath) {
  try {
    return Object.fromEntries(
      readFileSync(filePath, 'utf-8')
        .split('\n')
        .filter((line) => line && !line.startsWith('#') && line.includes('='))
        .map((line) => {
          const [key, ...rest] = line.split('=');
          return [key.trim(), rest.join('=').trim()];
        }),
    );
  } catch {
    return {};
  }
}

export default defineConfig({
  test: {
    environment: 'node',
    env: parseEnvFile(resolve(process.cwd(), '.env')),
  },
});
