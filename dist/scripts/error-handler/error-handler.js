const fadeIn = 2000,
    fadeOut = 2000,
    delay = 1000,
    info = 'info',
    error = 'error';

class ErrorHandler {
    constructor(errorContainer) {
        this.errorContainer = errorContainer;
    }

    showInfo(message, severity) {
        if (severity === error)
            $(this.errorContainer).removeClass('error-container-info').addClass('error-container-error');
        else if (severity === info)
            $(this.errorContainer).removeClass('error-container-error').addClass('error-container-info');

        $(this.errorContainer).html(message);
        $(this.errorContainer)
            .fadeIn(2000)
            .delay(1000)
            .fadeOut(2000, function () {
                if (severity === error)
                    $(this.errorContainer).removeClass('error-container-error').addClass('error-container-info');
                $(this.errorContainer).empty();
            });
    }
}
