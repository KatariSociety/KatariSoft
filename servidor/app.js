const express = require('express');
const { join } = require('node:path');
const app = express();

// Servir archivos estáticos de la carpeta cliente
app.use(express.static(join(__dirname, '../cliente')));

app.use(express.static(path.join(__dirname, '../public')));


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
