import { IStorageProvider } from '../models/IStorageProvider';

export class FakeStorageProvider implements IStorageProvider {
  private photosStorage: string[] = [];

  private avatarStorage: string[] = [];

  public async saveAvatarFile(file: string): Promise<string> {
    this.avatarStorage.push(file);

    return file;
  }

  public async deleteAvatarFile(file: string): Promise<void> {
    const findIndex = this.avatarStorage.findIndex(
      storageFile => storageFile === file,
    );

    this.avatarStorage.splice(findIndex, 1);
  }

  public async savePhotoFile(file: string): Promise<string> {
    this.photosStorage.push(file);

    return file;
  }

  public async deletePhotoFile(file: string): Promise<void> {
    const findIndex = this.photosStorage.findIndex(
      storageFile => storageFile === file,
    );

    this.photosStorage.splice(findIndex, 1);
  }

  public async deleteTmpFile(file: string): Promise<void> {
    const findIndex = this.photosStorage.findIndex(
      storageFile => storageFile === file,
    );

    this.photosStorage.splice(findIndex, 1);
  }
}
