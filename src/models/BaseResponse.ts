export class BaseResponse {
    status: String = "success"
    message: String = "OK"
    data: any = null

    constructor(data?: any) {
        if (data instanceof Error) {
            this.setError(data);
        } else
            this.data = data
    }

    setError(error: Error): void {
        this.status = `failed`;
        this.message = error.message;
    }

}