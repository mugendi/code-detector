/**
 * Copyright (c) 2024 Anthony Mugendi
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import detect from './index.js';

let filePath = './index.js';

detect(filePath)
  .then((resp) => {
    console.log(resp);
  })
  .catch(console.error);
