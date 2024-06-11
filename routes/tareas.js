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
    if (estado === 1) {
      return response.status(200).json({ message: 'Tarea chequeda' });
    }
    // if (!REGEX_TEXT.test(texto)) {
    //   console.log(1);
    //   return response.status(400).json({ message: 'La tarea invalida' });
    // } else if (estado !== true) {
    //   console.log(2);
    //   return response.status(400).json({ message: 'tarea sin chequear' });
    // }
    // console.log(3);
    const statement = db.prepare(
      `
        UPDATE tasks  SET 
      texto = ?, 
      estado = ? 
        WHERE 
        text_id = ? AND user_id = ?  
         RETURNING *
      `,
    );
    // console.log(3, statement);

    const updateTasks = statement.get(
      texto,
      estado,
      Number(request.params.id),
      Number(request.query.userId),
    );
    console.log(4, updateTasks);

    if (!updateTasks) {
      // console.log(5);

      return response.status(400).json({ error: 'La tarea no existe' });
    }
    // console.log(6);

    return response.status(200).json(updateTasks);
  } catch (error) {
    console.log('errrorrrrr', error);
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
    // const { estado } = request.body;
    // if (estado.length) {
    //   return response.status(200).json({ message: 'Tareas sin chequear' });
    // }  else if (estado === 1) {
    //   return response.status(200).json({ message: 'Tareas chequedas' });
    // } else {
    //   return response.status(200).json({ message: 'total' });
    // }

    const statement = db.prepare(' SELECT * FROM tasks WHERE  user_id = ?  ');
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
