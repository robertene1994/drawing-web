const prod = true,
    apiURL = setApiServer(),
    errorHandler = new ErrorHandler($('#error-container')),
    http = new Http(errorHandler);

$(function () {
    jQuery.validator.addMethod('whitespace', function (value, element) {
        return value !== undefined && value.trim() !== '';
    }, '¡El campo es obligatorio y no puede estar formado únicamente por espacios en blanco!');

    $('#signup-form').validate({
        onkeyup: false,
        onfocusout: false,
        onclick: false,
        onsubmit: false,
        rules: {
            firstName: {
                required: true,
                whitespace: true
            },
            lastName: {
                required: true,
                whitespace: true
            },
            email: {
                required: true,
                whitespace: true,
                email: true
            },
            password: {
                required: true,
                whitespace: true,
            },
            repeatedPassword: {
                required: true,
                whitespace: true,
                equalTo: '#password'
            }
        },
        messages: {
            firstName: {
                required: '¡El nombre es obligatorio!',
                whitespace: '¡El nombre es obligatorio y no puede estar formado únicamente por espacios en blanco!'
            },
            lastName: {
                required: '¡Los apellidos son obligatorios!',
                whitespace: '¡Los apellidos son obligatorios y no pueden estar formados únicamente por espacios en blanco!'
            },
            email: {
                required: '¡El correo electrónico es obligatorio!',
                email: '¡El correo electrónico debe debe segurir el formato texto@texto.texto!'
            },
            password: {
                required: '¡La contraseña es obligatoria!',
                whitespace: '¡La contraseña es obligatoria y no puede estar formada únicamente por espacios en blanco!',
            },
            repeatedPassword: {
                required: '¡Repetir la contraseña es obligatorio!',
                whitespace: '¡La contraseña repetida es obligatoria y no puede estar formada únicamente por espacios en blanco!',
                equalTo: '¡Las dos contraseñas proporcionadas no son idénticas!'
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

    $('#signup-form').submit(function (e) {
        e.preventDefault();
        if ($(this).valid())
            signup();
    });
});

function setApiServer() {
    if (prod) {
        return 'https://drawing-back-end.herokuapp.com';
    } else {
        return 'http://localhost:4201';
    }
}

function signup() {
    const firstName = $('#signup-form input[name=firstName]').val(),
        lastName = $('#signup-form input[name=lastName]').val(),
        email = $('#signup-form input[name=email]').val(),
        password = $('#signup-form input[name=password]').val(),
        user = new User(firstName, lastName, email, password);

    http.signup(`${apiURL}/user/signup`, user).then(response => {
        $('form')[0].reset();
        errorHandler.showInfo('¡Su cuenta ha sido creada correctamente!', 'info');
    });
}
