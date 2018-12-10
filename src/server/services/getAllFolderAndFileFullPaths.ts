import * as fse from 'fs-extra';

import { getFullPath } from './getFullPath';

/**
 * Adds all files and folders full paths from folder to appropriate passed arrays recursively
 * @param {string} folderPath - folder path, which from need to get all files and folders
 * @param {string[]} folderPaths - all full folders paths
 * @param {string[]} filePaths - all full files paths
 */
export async function getAllFolderAndFileFullPaths(folderPath: string, folderPaths: string[], filePaths: string[]): Promise<void> {
  const allPaths = await fse.readdir(folderPath);

  await Promise.all(allPaths.map(async (receivedPath) => {
    const fullPath = getFullPath(folderPath, receivedPath);

    const pathStat = await fse.stat(fullPath);

    if (pathStat.isDirectory()) {
      folderPaths.push(fullPath);
      await getAllFolderAndFileFullPaths(fullPath, folderPaths, filePaths);
    } else {
      filePaths.push(fullPath);
    }
  }));
}
