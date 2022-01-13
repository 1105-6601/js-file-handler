export declare class FileHandler
{
  static toBase64(blob: Blob): Promise<string>;
  static fromBase64(base64: string, mimeType: string): Blob;
  static fromNetwork(url: string, outputFormat: string): Promise<Blob>;
  static resizeImage(blob: Blob, maxSize: number, type: string, quality: number): Promise<Blob>;
  static fromArrayBuffer(arrayBuffer: ArrayBuffer): Blob;
  static arrayBufferToBase64(arrayBuffer: ArrayBuffer): string;
}
