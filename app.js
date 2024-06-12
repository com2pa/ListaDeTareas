const express = require('express');
const morgan = require('morgan');
const usersRouter = require('./routes/users');

const app = express();
const cors = require('cors');
const tasksRouter = require('./routes/tareas');
const verifyUser = require('./middlewares/verifyUser');

//middleware
//rutas ...
app.use(cors());
app.use(express.json()); // recibe json y enviar json y convierte a javascript
app.use(morgan('tiny')); //son las llamadas error 404
app.use(express.urlencoded({ extended: true })); //verifica que contenido se envia el frontend

//rutas backend
app.get('/', async (request, response) => {
  return response.status(200).json({ Lista: 'Tareas' });
});

app.use('/api/users', usersRouter);
app.use('/api/tasks/', verifyUser, tasksRouter);

module.exports = app; //para exportar la aplicacion y utilizar en cualquier parte de la aplicacion
