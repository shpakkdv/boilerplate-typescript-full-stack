export interface IAppState {
  downloadingInProgress: boolean;

  uploadingInProgress: boolean;
  uploadedSuccessfully: boolean;
  selectedFile: File;
  uploaded: number;
}

export interface IAppProps {

}
