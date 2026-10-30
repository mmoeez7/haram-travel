export type StorageFolder = "packages" | "hotels";

export type UploadedObject = {
  /** Stable storage key (path relative to provider root). */
  key: string;
  /** Public URL or path stored in the database. */
  url: string;
  contentType: string;
  size: number;
};

export interface StorageProvider {
  upload(
    file: File | Buffer,
    options: {
      folder: StorageFolder;
      filename?: string;
      contentType: string;
    }
  ): Promise<UploadedObject>;
  delete(key: string): Promise<void>;
  getPublicUrl(key: string): string;
}
