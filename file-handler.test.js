import { FileHandler } from './file-handler.js';
import * as fs         from 'fs';
import * as path       from 'path';
import { jest }        from '@jest/globals'

jest.setTimeout(1000 * 10);

describe('FileHandlerのテスト', () => {

  describe('Blob型の画像ファイルを', () => {

    let blob;

    beforeEach(() => {
      const buffer = fs.readFileSync(path.join(process.cwd(), '/assets/test.jpg'));
      blob         = FileHandler.fromArrayBuffer(buffer);
    });

    it('Base64文字列に変換する', (done) => {
      FileHandler.toBase64(blob).then(base64 => {
        expect(base64.endsWith('+xSEhlVn8oYC0zoijitL27IZMtIGHPFwwQANXmKF5hui/OZmiRk4MplUWjHBMxtqXy56n//2Q==')).toBeTruthy();
        done();
      });
    });

    it('リサイズしてBlobとして取得する', (done) => {
      FileHandler.resizeImage(blob).then(blob => {
        FileHandler.toBase64(blob).then(base64 => {
          expect(base64.endsWith('+Zufu10pt7C1s5dZ1f8AdtcMPLVpPm2/woP7xqlZaJeX14mo39vDa28anyLRl+7/AHXPvRb7gv1Z/9k=')).toBeTruthy();
          done();
        });
      });
    });
  });

  describe('Base64文字列を', () => {

    // 10 x 10 transparent png image.
    const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC';

    it('Blob型に変換する', (done) => {
      const blob = FileHandler.fromBase64(base64);
      expect(blob).toBeInstanceOf(Blob);

      FileHandler.toBase64(blob).then(result => {
        expect(result).toBe(base64);

        const image = new Image();
        image.addEventListener('load', () => {
          expect(image.width).toBe(10);
          expect(image.height).toBe(10);
          done();
        });

        image.src = `data:image/png;base64,${result}`;
      });
    });
  });

  describe('ネットワーク上の画像リソースを', () => {

    const networkResource = 'https://placekitten.com/200/300';

    it('取得してBlob型に変換する', (done) => {
      FileHandler.fromNetwork(networkResource).then(blob => {
        expect(blob).toBeInstanceOf(Blob);

        FileHandler.toBase64(blob).then(result => {

          const image = new Image();
          image.addEventListener('load', () => {
            expect(image.width).toBe(200);
            expect(image.height).toBe(300);
            done();
          });

          image.src = `data:image/png;base64,${result}`;
        });
      });
    });
  });

  describe('ArrayBufferを', () => {

    let buffer;

    beforeEach(() => buffer = fs.readFileSync(path.join(process.cwd(), '/assets/test.jpg')));

    it('Blob型に変換する', () => {
      const blob = FileHandler.fromArrayBuffer(buffer);
      expect(blob).toBeInstanceOf(Blob);
    });

    it('Base64文字列に変換する', () => {
      const base64 = FileHandler.arrayBufferToBase64(buffer);
      expect(base64.endsWith('+xSEhlVn8oYC0zoijitL27IZMtIGHPFwwQANXmKF5hui/OZmiRk4MplUWjHBMxtqXy56n//2Q==')).toBeTruthy();
    });
  });
});
