class HttpError extends Error {
    public statusCode: number
    public data: unknown

    constructor( data = null, statusCode:number, message:string ) {
        super(message)
        this.name = 'HttpError'
        this.statusCode = statusCode
        this.data = data
    }
}

export default HttpError
