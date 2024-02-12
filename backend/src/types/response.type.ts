export interface CustomResponse<Type> {
  isError: boolean;
  message: string;
  data: Type;
}
