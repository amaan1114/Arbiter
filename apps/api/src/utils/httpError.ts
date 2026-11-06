class HttpError extends Error {
    public statusCode: number
    public data: unknown

    constructor(statusCode:number, message:string , data = null) {
        super(message)
        this.name = 'HttpError'
        this.statusCode = statusCode
        this.data = data
    }
}

export default HttpError
