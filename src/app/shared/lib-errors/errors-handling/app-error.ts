export class AppError extends Error {
  error: number;

  constructor(errorData: { error: number; message: string }) {
    super(errorData.message);
    this.error = errorData.error;
  }
}
