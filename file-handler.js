'use strict';

export class FileHandler {
  static toBase64(blob)
  {
    const reader  = new FileReader();
    const promise = new Promise(resolve => {
      reader.addEventListener('load', (event) => {
        const arrayBuffer = event.target.result;
        resolve(FileHandler.arrayBufferToBase64(arrayBuffer));
      });
    });

    reader.readAsArrayBuffer(blob);

    return promise;
  }

  static fromBase64(base64, mimeType = 'image/jpeg')
  {
    const binaryString = atob(base64);
    const charCodeArr  = [];
    for (let i = 0, len = binaryString.length; i < len; ++i) {
      const code = binaryString.charCodeAt(i);
      if (code < 0 || 255 < code) {
        throw new Error('Invalid range detected of character code.');
      }
      charCodeArr[i] = code;
    }
    const typedArray = Uint8Array.from(charCodeArr);

    return new Blob([typedArray], {type: mimeType});
  }

  static fromNetwork(url, outputFormat = 'image/jpeg')
  {
    const img     = new Image();
    const promise = new Promise(resolve => {
      img.crossOrigin = 'Anonymous';
      img.addEventListener('load', _ => {
        const canvas  = document.createElement('canvas');
        const ctx     = canvas.getContext('2d');
        canvas.height = img.height;
        canvas.width  = img.width;
        ctx.drawImage(img, 0, 0);

        const dataUrl = canvas.toDataURL(outputFormat);
        const base64  = dataUrl.split(',')[1];

        resolve(FileHandler.fromBase64(base64));
      });
    });

    img.src = url;

    return promise;
  }

  static resizeImage(blob, maxSize = 1000, type = 'image/jpeg', quality = 0.92)
  {
    const reader  = new FileReader();
    const promise = new Promise(resolve => {
      reader.addEventListener('load', (event) => {
        const dataUrl = event.target.result;
        const image   = new Image();
        image.addEventListener('load', () => {
          const canvas = document.createElement('canvas');
          let width    = image.width;
          let height   = image.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width  = width;
          canvas.height = height;

          canvas.getContext('2d').drawImage(image, 0, 0, width, height);
          canvas.toBlob(blob => {
            resolve(blob);
          }, type, quality);
        });

        image.src = dataUrl;
      });
    });

    reader.readAsDataURL(blob);

    return promise;
  }

  static fromArrayBuffer(arrayBuffer)
  {
    const base64 = FileHandler.arrayBufferToBase64(arrayBuffer);

    return FileHandler.fromBase64(base64);
  }

  static arrayBufferToBase64(arrayBuffer)
  {
    const typedArray = new Uint8Array(arrayBuffer);
    const buffer     = 1024;
    let binaryString = '';
    for (let i = 0; i < typedArray.length; i += buffer) {
      binaryString += String.fromCharCode.apply(null, typedArray.slice(i, i + buffer));
    }

    return btoa(binaryString);
  }

  static identifyMimeTypeFromBase64(base64)
  {
    const signatures = [
      {
        'mimeType':   'application/pdf',
        'startsWith': 'JVBERi0',
      },
      {
        'mimeType':   'image/gif',
        'startsWith': 'R0lGODdh',
      },
      {
        'mimeType':   'image/gif',
        'startsWith': 'R0lGODlh',
      },
      {
        'mimeType':   'image/png',
        'startsWith': 'iVBORw0KGgo',
      },
      {
        'mimeType':   'image/jpg',
        'startsWith': '/9j/',
      },
    ];

    for (const item of signatures) {
      if (base64.startsWith(item.startsWith)) {
        return item.mimeType;
      }
    }

    throw new Error('Failed to identify mime type.');
  }
}
