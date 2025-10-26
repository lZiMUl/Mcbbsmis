import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

function getView(file: string): string {
  return readFileSync(join(resolve('.'), 'public/html', `${file}.html`), {
    encoding: 'utf8'
  });
}

export default getView;
