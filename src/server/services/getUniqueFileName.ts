import * as path from 'path';

export function getUniqueFileName(fileName: string, fileNames: string[] = []): string {
  const fileNameMap = {} as { [fileName: string]: boolean };

  fileNames.forEach((fileName) => {
    fileNameMap[path.basename(fileName)] = true;
  });

  const { base, name, ext } = path.parse(fileName);
  let uniqueName = base;

  let count = 1;
  while (fileNameMap[uniqueName]) {
    uniqueName = `${name} (${count++})${ext}`;
  }

  return uniqueName;
}
