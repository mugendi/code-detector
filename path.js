/**
 * Copyright (c) 2024 Anthony Mugendi
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import Path from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url); 
export const __dirname = Path.dirname(__filename);
export const path = Path;