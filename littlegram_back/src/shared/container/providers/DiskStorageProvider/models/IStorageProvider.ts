export interface IStorageProvider {
  saveAvatarFile(file: string): Promise<string>;
  deleteAvatarFile(file: string): Promise<void>;

  savePhotoFile(file: string): Promise<string>;
  deletePhotoFile(file: string): Promise<void>;

  deleteTmpFile(file: string): Promise<void>;
}
