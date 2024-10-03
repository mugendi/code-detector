'use strict';
/**
 * Copyright (c) 2024 Anthony Mugendi
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import fs from 'fs';
import LineByLineReader from 'line-by-line';
import { execSync } from 'child_process';
import shellEscape from 'shell-escape';
import Path from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url); 
export const __dirname = Path.dirname(__filename);
export const path = Path;


const aliases = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './lib/file-patterns/aliases.json'))
);
const extensions = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, './lib/file-patterns/extensions.json')
  )
);
const interpreters = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, './lib/file-patterns/interpreters.json')
  )
);

function byFileName(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} does not exist!`);
  }

  const extension = (path.extname(filePath) || '').toLowerCase();
  return extensions[extension];
}

async function byShebang(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} does not exist!`);
  }

  // pick line
  let line = await readLine(filePath);

  //
  let bang = line.split(/\r?\n/g)[0];
  let tokens = bang.replace(/^#! +/, '#!').split(' ');
  let pieces = tokens[0].split('/');
  let script = pieces[pieces.length - 1];

  //
  let lang = interpreters[script] || aliases[script];

  return lang;
}

function readLine(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} does not exist!`);
  }

  return new Promise((resolve, reject) => {
    const lr = new LineByLineReader(filePath);
    let data = '';

    lr.on('line', function (line) {
      data += line;
      lr.close();
    });

    lr.on('end', function () {
      resolve(data);
    });
  });
}

async function byHyperpolyglotAPI(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} does not exist!`);
  }

  try {
    execSync(`which hyply`).toString();
    // console.log(sss);
  } catch (error) {
    // console.error(({E:error}));
    throw new Error(
      `Hyperpolyglot not installed. \nPlease check 'https://github.com/monkslc/hyperpolyglot' 👉 cargo install hyperpolyglot `
    );
  }

  let [possibility, lang] = execSync(`hyply ${shellEscape([filePath])} `)
    .toString()
    .split(/\s+/);

  possibility = Number(possibility.replace(/%$/, ''));

  // console.log({ possibility });
  if (possibility > 60) {
    return lang;
  }
}

export default async function detect(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} does not exist!`);
  }

  let lang = await byFileName(filePath);

  if (!lang) {
    lang = await byShebang(filePath);
  }

  if (!lang) {
    lang = await byHyperpolyglotAPI(filePath);
  }

  return lang;
}
