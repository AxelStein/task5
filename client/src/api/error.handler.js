const handleApiError = (err) => {
    if (err.response) {
        const data = err.response.data;
        const r = {
            data,
            status: err.response.status,
        }
        if (typeof data === 'string') {
            r.message = data;
        } else {
            r.message = data.message;
        }
        return r;
    } else {
        return { message: err.message };
    }
}

export default handleApiError;