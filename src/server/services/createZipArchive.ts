import * as archiver from 'archiver';
import * as fse from 'fs-extra';
import * as path from 'path';

import { getFilenamesFromFolder } from './getFilenamesFromFolder';
import { getUniqueFileName } from './getUniqueFileName';

/**
 * Creates zip archive
 * @param {string[]} dirPaths - directories paths to include into archive (include all subdirectories and files deeply)
 * @param {string[]} filePaths - files paths to include into archive
 * @param {string} zipPath - path to save zip archive
 * @param {string} zipArchiveName - name of zip archive
 * @param {boolean = false} includeOnlyFolderContent - if `true`, include only folder content without folder, otherwise, include the folder as well
 * @returns {string} - path to created archive
 */
export async function createZipArchive(
  dirPaths: string[],
  filePaths: string[],
  zipPath: string,
  zipArchiveName: string,
  includeOnlyFolderContent = false,
): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    const archive = archiver(
      'zip',
      // sets the compression level
      { zlib: { level: 9 } },
    );

    await fse.ensureDir(zipPath);

    const filenames = await getFilenamesFromFolder(zipPath);
    const uniqueArchiveName = getUniqueFileName(zipArchiveName, filenames);

    const outputPath = path.join(zipPath, uniqueArchiveName);
    const output = fse.createWriteStream(outputPath);

    output.on('close', () => {
      console.log(`The ${uniqueArchiveName} archive successfully created and has ${archive.pointer()} total bytes.`);
      resolve(outputPath);
    });

    archive.on('error', (error) => {
      reject(error);
    });

    archive.pipe(output);

    // add all from folders to archive deeply
    dirPaths.forEach((dirPath) => {
      archive.directory(dirPath, includeOnlyFolderContent ? false : path.basename(dirPath));
    });

    // add files to archive
    filePaths.forEach((filePath) => {
      archive.file(filePath, { name: path.basename(filePath) });
    });

    archive.finalize();
  });
}
