const express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || '4200';
app.set('port', port);

http.createServer(app).listen(port, () => {
    console.log(`Server started on port ${port}.`);
});
