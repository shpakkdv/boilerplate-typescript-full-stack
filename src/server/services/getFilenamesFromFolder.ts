import * as fse from 'fs-extra';

import { getFullPath } from './getFullPath';

export async function getFilenamesFromFolder(folderPath: string): Promise<string[]> {
  const filenames: string[] = [];
  const allPaths = await fse.readdir(folderPath);

  await Promise.all(allPaths.map(async (receivedPath) => {
    const fullPath = getFullPath(folderPath, receivedPath);

    const pathStat = await fse.stat(fullPath);

    if (pathStat.isFile()) {
      filenames.push(receivedPath);
    }
  }));

  return filenames;
}
