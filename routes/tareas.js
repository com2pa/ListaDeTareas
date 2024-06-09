const db = require('../db');
const tareasRouter = require('express').Router();
const REGEX_TEXT = /^[A-Z][a-zñA-ZÑ0-9\s\S]{4,500}$/;
// CREA
tareasRouter.post('/', async (request, response) => {
  try {
    const { texto, estado } = request.body;
    if (!REGEX_TEXT.test(texto)) {
      console.log(texto);
      return response.status(400).json({ error: 'La tarea es invalido' });
    }

    const statement = db.prepare(
      'INSERT INTO tasks (texto, user_id, estado) VALUES (?, ?, ?) RETURNING * ',
    );

    const newTask = statement.get(texto, Number(request.query.userId), estado);
    return response.status(200).json(newTask);
  } catch (error) {
    console.log(error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      console.log('error de SQL');
      return response.status(400).json({ error: 'El correo  ya esta en uso' });
    }
    return response.sendStatus(400);
  }
});
// ELIMINA
tareasRouter.delete('/:id', async (request, response) => {
  try {
    // obtener la tarea
    const tasksIdToDelete = request.params.id;
    const statement = db.prepare(
      'DELETE FROM tasks WHERE text_id = ? AND user_id = ? RETURNING * ',
    );
    const deletedTask = statement.get(Number(tasksIdToDelete), Number(request.query.userId));
    if (!deletedTask) {
      return response.status(400).json({ message: 'La tarea no existe' });
    }
    return response.status(200).json({ message: 'La tarea  ha sido eliminado' });
  } catch (error) {
    console.log(error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      console.log('error sql');
      return response.status(400).json({ error: 'El email ya esta en uso' });
    }
    return response.sendStatus(400);
  }
});
// ACTUALIZA
tareasRouter.put('/:id', async (request, response) => {
  try {
    // obtener la tarea
    const { texto, estado } = request.body;
    if (!REGEX_TEXT(texto)) {
      return response.status(400).json({ message: 'La tarea invalida' });
    } else if (estado === 1) {
      return response.status(200).json({ message: 'La tarea ejecutada' });
    }
    const statement = db.prepare(
      ' UPDATE tasks  SET texto = ? estado = ? WHERE text_id = ? and user_id = ?  RETURNING * ',
    );
    const updateTasks = statement.get(
      texto,
      estado,
      Number(request.params.id),
      Number(request.query.userId),
    );
    if (!updateTasks) {
      return response.status(400).json({ message: 'La tarea no existe' });
    }
    return response.status(200).json(updateTasks);
  } catch (error) {
    console.log(error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      console.log('error sql');
      return response.status(400).json({ error: 'El email ya esta en uso' });
    }
    return response.sendStatus(400);
  }
});

//
tareasRouter.put('/', async (request, response) => {
  try {
    const statement = db.prepare(' SELECT * FROM tasks WHERE user_id = ? RETURNING * ');
    const Tasks = statement.all(Number(request.query.userId));

    return response.status(200).json(Tasks);
  } catch (error) {
    console.log(error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      console.log('error sql');
      return response.status(400).json({ error: 'El email ya esta en uso' });
    }
    return response.sendStatus(400);
  }
});

module.exports = tareasRouter;
