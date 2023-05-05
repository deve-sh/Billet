class Response {
    status: number | null;
    sendStatus (status: number) {
        this.status = status;
    }
}

export default Response;