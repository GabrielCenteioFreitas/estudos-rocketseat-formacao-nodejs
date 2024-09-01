import fs from 'fs';
import { parse } from 'csv-parse';

const parser = fs.createReadStream('./csv-import/tasks.csv')
  .pipe(parse({ delimiter: ',', from_line: 2 }));

for await (const row of parser) {
  const [title, description] = row;

  await fetch('http://localhost:3333/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  });
}