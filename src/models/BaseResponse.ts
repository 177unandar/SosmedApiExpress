export class BaseResponse {
    success: boolean = true
    message: String = "OK"
    data: any = null

    constructor(data?: any) {
        if (data instanceof Error) {
            this.setError(data);
        } else
            this.data = data
    }

    setError(error: Error): BaseResponse {
        this.success = false;
        this.message = error.message;
        return this;
    }

    setErrorMessage(errorMessage: string): BaseResponse {
        this.success = false;
        this.message = errorMessage;
        return this;
    }

}