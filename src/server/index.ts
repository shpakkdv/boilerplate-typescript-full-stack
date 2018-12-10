import * as express from 'express';
import * as fse from 'fs-extra';
import * as multer from 'multer';
import * as path from 'path';

import { createZipArchive } from './services/createZipArchive';
import { getFilenamesFromFolder } from './services/getFilenamesFromFolder';
import { getUniqueFileName } from './services/getUniqueFileName';
import { initMockedData, getDataToArchive } from './services/mockedData';

initMockedData();

const app = express();

app.use(express.static('dist'));

// archives uploading
const destinationPath = path.resolve('data/uploads');
const storage = multer.diskStorage({
  destination: async (req, file, callback) => {
    await fse.ensureDir(destinationPath);

    callback(null, destinationPath);
  },
  filename: async (req, file, callback) => {
    const filenames = await getFilenamesFromFolder(destinationPath);
    const uniqueFilename = getUniqueFileName(file.originalname, filenames);

    callback(null, uniqueFilename);
  },
});

const upload = multer({ storage });

app.post('/api/uploadArchive', upload.single('file'), (req, res) => {});

// create and download archive
const archivesFolder = './data/zip-archives';

app.get('/api/createAndDownloadArchive', async (req, res) => {
  const { folders, files, archiveName } = getDataToArchive();
  const archivePath = await createZipArchive(folders, files, archivesFolder, archiveName);

  res.sendFile(path.resolve(archivePath), { headers: { filename: archiveName } });
});

app.listen(8080, () => console.log('Listening on port 8080!'));
