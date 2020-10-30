const prod = true,
    wsURL = setWebSocketServer(),
    apiURL = setApiServer(),
    errorHandler = new ErrorHandler($('#error-container')),
    http = new Http(errorHandler);

let webSocket,
    canvas;

$(function () {
    if (window.WebSocket) {
        $(window).ready(function () {
            initServer();
            initCanvas();
        });
        $(window).on('beforeunload', function () {
            onClose();
            localStorage.removeItem('email');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    } else {
        errorHandler.showInfo('¡Este navegador no soporta WebSockets!', 'error');
    }

    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    const email = localStorage.getItem('email');
    http.findByEmail(`${apiURL}/user/findByEmail/${email}`, email).then(response => {
        const user = new User().fromJson(response);
        $('#welcome-message').html(`¡Bienvenido ${user.lastName}, ${user.firstName}!`);
    });

    $('#logout').click(() => {
        onClose();
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    $('#addCircle').click(() => {
        sendObject('circle', {
            top: 50,
            left: 50,
            radius: 30,
            fill: '#28a745'
        });
    });

    $('#addRectangle').click(() => {
        sendObject('rect', {
            top: 50,
            left: 150,
            width: 100,
            height: 60,
            fill: '#bd2130'
        });
    });

    $('#addTriangle').click(() => {
        sendObject('triangle', {
            top: 50,
            left: 290,
            width: 60,
            height: 60,
            fill: '#007bff'
        });
    });

    $('#pencil').click(() => {
        canvas.isDrawingMode = true;
    });

    $('#selectFigure').click(() => {
        canvas.isDrawingMode = false;
    });

    $('#deleteFigure').click(() => {
        $('#deleteFigure').attr('disabled', 'true');
        if (canvas.getActiveObject()) {
            webSocket.send(JSON.stringify({
                operation: 'delete',
                id: canvas.getActiveObject().id
            }));
        } else {
            errorHandler.showInfo('¡No ha seleccionado ninguna figura para borrar!', 'error');
        }
    });
});

function setWebSocketServer() {
    if (prod) {
        return 'wss://drawing-back-end.herokuapp.com/draw';
    } else {
        return 'ws://localhost:4201/draw';
    }
}

function setApiServer() {
    if (prod) {
        return 'https://drawing-back-end.herokuapp.com';
    } else {
        return 'http://localhost:4201';
    }
}

function initServer() {
    webSocket = new WebSocket(wsURL);
    webSocket.onopen = onOpen;
    webSocket.onclose = onClose;
    webSocket.onmessage = onMessage;
}

function initCanvas() {
    canvas = new fabric.Canvas('canvas');
    canvas.freeDrawingBrush.color = '#d39e00';
    canvas.freeDrawingBrush.lineWidth = 10;

    canvas.on('path:created', (event) => {
        canvas.item(canvas.getObjects().length - 1).remove();
        canvas.renderAll();
        sendObject('path', event.path);
    });
    canvas.on('mouse:up', (event) => {
        if (canvas.getActiveObject() === null) {
            $('#deleteFigure').attr('disabled', 'true');
        } else {
            $('#deleteFigure').removeAttr('disabled');
        }
    });
    canvas.on('object:moving', (event) => {
        modifyObject(event.target);
    });
    canvas.on('object:rotating', (event) => {
        modifyObject(event.target);
    });
    canvas.on('object:scaling', (event) => {
        modifyObject(event.target);
    });
}

function onOpen() {
    webSocket.send(JSON.stringify({
        operation: 'open',
        email: localStorage.getItem('email')
    }));
}

function onClose() {
    webSocket.send(JSON.stringify({
        operation: 'close',
        email: localStorage.getItem('email')
    }));
    webSocket.close();
}

function onMessage(message) {
    if (isJson(message.data)) {
        const data = JSON.parse(message.data);
        if (data.operation === 'list' && data.content === 'users') {
            showUsers(data.data);
        } else if (data.operation === 'list' && data.content === 'draws') {
            for (let i = 0; i < data.data.length; i++)
                createObject(data.data[i]);
        } else if (data.operation === 'list' && data.content === 'draw') {
            createObject(data.data);
        } else if (data.operation === 'modify' && data.content === 'draw') {
            createObject(data.data);
        } else if (data.operation === 'delete' && data.content === 'draw') {
            deleteObject(data.data);
        }
    }
}

function showUsers(users) {
    $('#connected-users').html('');
    const email = localStorage.getItem('email');
    users.forEach(user => {
        if (user.email === email) {
            $('#connected-users').append(`<li class="font-weight-bold">${user.lastName}, ${user.firstName} (${user.email})</li>`);
        } else {
            $('#connected-users').append(`<li>${user.lastName}, ${user.firstName} (${user.email})</li>`);
        }
    });
}

function createObject(draw) {
    let shape;
    if (draw.type === 'triangle') {
        shape = new fabric.Triangle(draw.data);
    } else if (draw.type === 'rect') {
        shape = new fabric.Rect(draw.data);
    } else if (draw.type === 'circle') {
        shape = new fabric.Circle(draw.data);
    } else if (draw.type === 'path') {
        shape = new fabric.Path(draw.data.path, draw.data);
    }
    shape.id = draw.id;
    addObject(shape);
}

function deleteObject(id) {
    for (let i = 0; i < canvas.getObjects().length; i++) {
        if (canvas.item(i).id === id) {
            canvas.item(i).remove();
            canvas.renderAll();
            return;
        }
    }
}

function addObject(shape) {
    for (let i = 0; i < canvas.getObjects().length; i++) {
        if (canvas.item(i).id === shape.id) {
            canvas.item(i).set(shape).setCoords();
            canvas.renderAll();
            return;
        }
    }
    canvas.add(shape);
}

function modifyObject(draw) {
    webSocket.send(JSON.stringify({
        operation: 'modify',
        draw: {
            id: draw.id,
            type: draw.type,
            data: draw
        }
    }));
}

function sendObject(type, draw) {
    webSocket.send(JSON.stringify({
        operation: 'create',
        draw: {
            type: type,
            data: draw
        }
    }));
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
