export interface ISnackbarData {
    message: string;
    type: SnackbarType;
} 

export enum SnackbarType {
    Success = 'success',
    Error = 'error',
    Warning = 'warning'
}