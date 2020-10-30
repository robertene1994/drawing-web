class Http {
    constructor(errorHandler) {
        this.errorHandler = errorHandler;
    }

    login(serverUrl, user) {
        if (this.urlIsValid(serverUrl)) {
            return $.ajax({
                method: 'POST',
                url: serverUrl,
                data: JSON.stringify(user.toJson()),
                contentType: 'application/json'
            }).done(response => {
                return response;
            }).fail(response => {
                this.errorHandler.showInfo(response.responseJSON.message, 'error');
            });
        }
    }

    signup(serverUrl, user) {
        if (this.urlIsValid(serverUrl)) {
            return $.ajax({
                method: 'POST',
                url: serverUrl,
                data: JSON.stringify(user.toJson()),
                contentType: 'application/json'
            }).done(response => {
                return response;
            }).fail(response => {
                this.errorHandler.showInfo(response.responseJSON.message, 'error');
            });
        }
    }

    findByEmail(serverUrl, email) {
        if (email && email.trim() !== '') {
            if (this.urlIsValid(serverUrl)) {
                return $.ajax({
                    method: 'GET',
                    headers: {
                        'Authorization': `${JSON.parse(localStorage.getItem('token'))}`
                    },
                    url: serverUrl
                }).done(response => {
                    return response;
                }).fail(response => {
                    this.handleException(response);
                });
            }
        }
    }

    urlIsValid(url) {
        return url !== undefined && url.trim() !== '';
    }

    handleException(response) {
        const status = response.status;
        if (status !== undefined) {
            if (status == 401)
                this.errorHandler.showInfo('¡Las credenciales proporcionadas no son válidas!', 'error');
            else if (status == 405)
                this.errorHandler.showInfo('¡La operación no está permitida!', 'error');
            else if (status == 404)
                this.errorHandler.showInfo('¡El recurso no ha podido ser encontrado!', 'error');
            else
                this.errorHandler.showInfo(response.responseJSON.message, 'error');
        }
    }
}