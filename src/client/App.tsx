import axios from 'axios';
import * as React from 'react';
import { downloadFile } from './services/downloadFile';
import * as Models from './models';

import './app.css';

export default class App extends React.PureComponent<Models.IAppProps, Models.IAppState> {
  fileInput = React.createRef<HTMLInputElement>();

  state: Models.IAppState = {
    downloadingInProgress: false,

    uploadingInProgress: false,
    uploadedSuccessfully: false,
    selectedFile: null,
    uploaded: null,
  };

  onCreateArchiveClick = async (): Promise<void> => {
    this.setState({
      downloadingInProgress: true,
    });

    const result = await fetch('/api/createAndDownloadArchive');
    downloadFile(await result.blob(), result.headers.get('filename') || 'archive.zip');

    this.setState({
      downloadingInProgress: false,
    });
  }

  onUploadClick = (): void => {
    this.setState({
      uploadingInProgress: true,
    });

    const { selectedFile } = this.state;

    const data = new FormData();
    data.append('file', selectedFile, selectedFile.name);

    axios
      .post('/api/uploadArchive', data, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.loaded === progressEvent.total) {
            this.setState({
              uploadedSuccessfully: true,
            });
          }

          this.setState({
            uploaded: Math.round(progressEvent.loaded / progressEvent.total * 100),
          });
        },
      });
  }

  selectArchive = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      selectedFile: event.target.files[0],
    });
  }

  onCancelClick = (): void => {
    if (this.fileInput) {
      this.fileInput.current.value = null;
    }

    this.setState({
      selectedFile: null,
    });
  }

  onOkClick = (): void => {
    this.setState({
      uploadingInProgress: false,
      uploadedSuccessfully: false,
      uploaded: null,
    });

    this.onCancelClick();
  }

  render() {
    const { downloadingInProgress, uploadingInProgress, selectedFile, uploaded, uploadedSuccessfully } = this.state;

    return (
      <div>
        <br />
        <button onClick={this.onCreateArchiveClick} disabled={downloadingInProgress}>Create and download zip archive</button>
        <hr />
        <br />
        <div className="upload-article">
          <div className="choose-file">
            <input
              type="file"
              accept="application/zip"
              ref={this.fileInput}
              disabled={uploadingInProgress}
              onChange={this.selectArchive}
            />
            <button onClick={this.onCancelClick} disabled={uploadingInProgress || !selectedFile}>X</button>
          </div>
          <br />
          <button
            className="upload-button"
            onClick={this.onUploadClick}
            disabled={uploadingInProgress || !selectedFile}
          >
            Upload zip archive
          </button>
          {uploaded &&
            <div className="uploading-status">
              {`${uploaded}%`}
              {uploadedSuccessfully &&
                <span>
                  <p><b>{selectedFile.name}</b>{' was uploaded successfully.'}</p>
                  <button onClick={this.onOkClick}>OK</button>
                </span>
              }
            </div>
          }
        </div>
        <br />
        <hr />
      </div>
    );
  }
}
