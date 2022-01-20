# JS FileHandler

[![Build Status](https://app.travis-ci.com/1105-6601/js-file-handler.svg?branch=master)](https://app.travis-ci.com/1105-6601/js-file-handler)
[![GitHub tag](https://img.shields.io/github/tag/1105-6601/js-file-handler.svg?label=latest)](https://www.npmjs.com/package/@tkzo/js-file-handler)
[![Downloads](https://img.shields.io/npm/dm/js-file-handler)](https://www.npmjs.com/package/@tkzo/js-file-handler)
[![License](https://img.shields.io/github/license/1105-6601/js-file-handler)](https://www.npmjs.com/package/@tkzo/js-file-handler)

File handler for JavaScript.

# Installation

```shell
npm i @tkzo/js-file-handler --save
```

# Usage

1. Import module

   JavaScript
   ```javascript
   import { FileHandler } from './file-handler.js';

   ```
   
   TypeScript
   ```typescript
   import { FileHandler } from '@tkzo/js-file-handler';
   ```

2. Call APIs

- Convert blob to base64
   
   ```javascript
   FileHandler.toBase64(blob).then(base64 => {
     // ...
   });
   ```

- Convert base64 to blob

   ```javascript
   const blob = FileHandler.fromBase64(base64);
   ```
  
- Resize image

   ```javascript
   FileHandler.resizeImage(blob, 1200, 'image/jpeg', 0.92).then(blob => {
     // ...
   });
   ```

- Create blob from network image

   ```javascript
   FileHandler.fromNetwork('https://placekitten.com/200/300').then(blob => {
     // ...
   });
   ```

- Identify MimeType

   ```javascript
   const mimeType = FileHandler.identifyMimeTypeFromBase64(base64);
   ```
