const prod = true,
    apiURL = setApiServer(),
    errorHandler = new ErrorHandler($('#error-container')),
    http = new Http(errorHandler);

$(function () {
    if (localStorage.getItem('token')) {
        window.location.href = 'draw.html';
        return;
    }

    jQuery.validator.addMethod('whitespace', function (value, element) {
        return value !== undefined && value.trim() !== '';
    }, '¡El campo es obligatorio y no puede estar formado únicamente por espacios en blanco!');

    $('#login-form').validate({
        onkeyup: false,
        onfocusout: false,
        onclick: false,
        onsubmit: false,
        rules: {
            email: {
                required: true,
                whitespace: true,
                email: true
            },
            password: {
                required: true,
                whitespace: true,
            }
        },
        messages: {
            email: {
                required: '¡El correo electrónico es obligatorio!',
                email: '¡El correo electrónico debe debe segurir el formato texto@texto.texto!'
            },
            password: {
                required: '¡La contraseña es obligatoria!',
                whitespace: '¡La contraseña es obligatoria y no puede estar formada únicamente por espacios en blanco!',
            }
        },
        showErrors: function (errorMap, errorList) {
            if (errorList.length)
                this.errorList = [errorList.shift()];
            this.defaultShowErrors();
        },
        errorPlacement: function (error, element) {
            errorHandler.showInfo(error.text(), 'error');
        }
    });

    $('#login-form').submit(function (e) {
        e.preventDefault();
        if ($(this).valid())
            login();
    });
});

function setApiServer() {
    if (prod) {
        return 'https://drawing-back-end.herokuapp.com';
    } else {
        return 'http://localhost:4201';
    }
}

function login() {
    const email = $('#login-form input[name=email]').val(),
        password = $('#login-form input[name=password]').val(),
        credentials = new Credentials(email, password);

    http.login(`${apiURL}/user/login`, credentials).then(response => {
        $('form')[0].reset();
        localStorage.setItem('email', email);
        localStorage.setItem('token', JSON.stringify(response));
        window.location.href = 'draw.html';
    });
}
