import * as path from 'path';

export function getFullPath(prevPath: string, nextPath?: string): string {
  return path.resolve(path.join(prevPath, nextPath || ''));
}
