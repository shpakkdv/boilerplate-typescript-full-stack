import { getAllFolderAndFileFullPaths } from './getAllFolderAndFileFullPaths';
import { random } from './random';

const mockedFolderPath = './data/test-data';

const mockedFolderPaths: string[] = [];
const mockedFilePaths: string[] = [];

export async function initMockedData() {
  await getAllFolderAndFileFullPaths(mockedFolderPath, mockedFolderPaths, mockedFilePaths);

  console.log('Mocked folder paths:', mockedFolderPaths);
  console.log('Mocked file paths:', mockedFilePaths);
}

export function getDataToArchive(): IDataToArchive {
  const folders: string[] = [];
  const files: string[] = [];

  const foldersAmount = random(0, mockedFolderPaths.length);
  const filesAmount = random(0, mockedFilePaths.length);

  while (folders.length < foldersAmount) {
    const folderPath = mockedFolderPaths[random(0, mockedFolderPaths.length - 1)];

    if (!folders.includes(folderPath)) {
      folders.push(folderPath);
    }
  }

  while (files.length < filesAmount) {
    const filePath = mockedFilePaths[random(0, mockedFilePaths.length - 1)];

    if (!files.includes(filePath)) {
      files.push(filePath);
    }
  }

  console.log(`Folders amount: ${foldersAmount}.`);
  console.log('Folders paths:', folders);

  console.log(`Files amount: ${filesAmount}.`);
  console.log('Files paths:', files);

  return {
    folders,
    files,
    archiveName: 'zip-archive.zip',
  };
}

interface IDataToArchive {
  folders: string[];
  files: string[];
  archiveName: string;
}
