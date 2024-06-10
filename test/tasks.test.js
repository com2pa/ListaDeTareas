const supertest = require('supertest');
const app = require('../app');
const { describe, test, expect, beforeAll } = require('@jest/globals');
const db = require('../db');
const api = supertest(app);
let tarea;
let users;
// let lista = [
//   {
//     texto: 'Tengo que ir colegio',
//     estado: false,
//   },
//   {
//     texto: 'Hacer dos tareas diarias',
//     estado: false,
//   },
//   {
//     texto: 'Hacer una lista ',
//     estado: false,
//   },
// ];
describe('ruta tareas', () => {
  describe('crear una tarea', () => {
    beforeAll(() => {
      const statementDeleteUsers = db.prepare('DELETE FROM users');
      statementDeleteUsers.run();
      const statementCreateUser = db.prepare(
        `
                INSERT INTO users (email) VALUES (?) RETURNING *`,
      );
      users = statementCreateUser.get('com2pavegas@gmail.com');
    });

    test('crea una tarea cuando todo es correcto', async () => {
      const response = await api
        .post('/api/tasks')
        .query({ userId: users.user_id })
        .send({ texto: 'Tengo que hacer las tareas', estado: 0 })
        .expect(200)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        text_id: 1,
        texto: 'Tengo que hacer las tareas',
        user_id: 1,
        estado: 0,
      });
    });
  });
  describe('tarea vacia', () => {
    beforeAll(() => {
      const statementDeleteUsers = db.prepare('DELETE FROM users');
      statementDeleteUsers.run();
      const statementCreateUser = db.prepare(
        `
                INSERT INTO users (email) VALUES (?) RETURNING *`,
      );
      users = statementCreateUser.get('com2pavegas@gmail.com');
    });

    test('no crea una tarea cuando el texto esta vacio', async () => {
      const response = await api
        .post('/api/tasks')
        .query({ userId: users.user_id })
        .send({ texto: ' ' })
        .expect(400)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({ error: 'La tarea es invalido' });
    });
  });
  describe('tarea con texto invalido', () => {
    beforeAll(() => {
      const statementDeleteUsers = db.prepare('DELETE FROM users');
      statementDeleteUsers.run();
      const statementCreateUser = db.prepare(
        `
                INSERT INTO users (email) VALUES (?) RETURNING *`,
      );
      users = statementCreateUser.get('com2pavegas@gmail.com');
    });

    test('no crea una tarea cuando el texto invalido', async () => {
      const response = await api
        .post('/api/tasks')
        .query({ userId: users.user_id })
        .send({ texto: 'tengo que hacer causa' })
        .expect(400)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({ error: 'La tarea es invalido' });
    });
  });
  describe('eliminar una tarea', () => {
    beforeAll(() => {
      const statementDeleteUsers = db.prepare('DELETE FROM users');
      statementDeleteUsers.run();
      const statementCreateUser = db.prepare(
        `
                INSERT INTO users (email) VALUES (?) RETURNING * `,
      );
      users = statementCreateUser.get('com2pavegas@gmail.com');
      const statementDeleteTasks = db.prepare('DELETE FROM tasks');
      statementDeleteTasks.run();
      const statementCreateTask = db.prepare(
        `
                INSERT INTO tasks (texto, user_id) VALUES (?, ?) RETURNING * `,
      );
      tarea = statementCreateTask.get('Tengo que hacer la tarea', users.user_id);
    });

    test('eliminar una tarea cuando todo es correcto', async () => {
      const response = await api
        .delete(`/api/tasks/${tarea.text_id}`)
        .query({ userId: users.user_id })
        .expect(200)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        message: 'La tarea  ha sido eliminado',
      });
    });
    test('No elimina cuando el usuario no pertence a la tarea', async () => {
      const response = await api
        .delete(`/api/tasks/${tarea.text_id + 1}`)
        .query({ userId: users.user_id })
        .expect(400)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        message: 'La tarea no existe',
      });
    });
    test('No elimina cuando la tarea no existe', async () => {
      const response = await api
        .delete(`/api/tasks/${tarea.text_id + 1}`)
        .query({ userId: users.user_id })
        .expect(400)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        message: 'La tarea no existe',
      });
    });
  });
  describe('actualiza una tarea', () => {
    beforeAll(() => {
      const statementDeleteUsers = db.prepare('DELETE FROM users');
      statementDeleteUsers.run();
      const statementCreateUser = db.prepare(
        `
                INSERT INTO users (email) VALUES (?) RETURNING * `,
      );
      users = statementCreateUser.get('com2pavegas@gmail.com');
      const statementDeleteTasks = db.prepare('DELETE FROM tasks');
      statementDeleteTasks.run();
      const statementCreateTask = db.prepare(
        `
                  INSERT INTO tasks (texto, user_id, estado) VALUES (?, ?, ?) RETURNING * `,
      );
      tarea = statementCreateTask.get('Tengo que hacer la tarea', users.user_id, 1);
      console.log('veeeeeeeeee', tarea);
    });
    console.log(1);
    test('chequea  una tarea cuando todo es correcto', async () => {
      const response = await api
        .put(`/api/tasks/${tarea.text_id}`)
        .query({ userId: users.user_id })
        .send({ texto: 'Tengo que hacer las tareas', estado: 1 })
        .expect(200)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        message: 'Tarea chequeda',
      });
    });
    console.log(2);
  });
  describe('obtener las tareas', () => {
    beforeAll(() => {
      const statementDeleteUsers = db.prepare('DELETE FROM users');
      statementDeleteUsers.run();
      const statementCreateUser = db.prepare(
        `
                INSERT INTO users (email) VALUES (?) RETURNING * `,
      );
      users = statementCreateUser.get('com2pavegas@gmail.com');
      const statementDeleteTasks = db.prepare('DELETE FROM tasks');
      statementDeleteTasks.run();
      const statementCreateTask = db.prepare(
        `
                  INSERT INTO tasks (texto, user_id, estado) VALUES (?,?, ?) RETURNING * `,
      );
      return statementCreateTask.get(tarea.texto, users.user_id, tarea.estado);
    });

    test('obtengo los contatos cuando el usuario no inicio sesion', async () => {
      const response = await api
        .get('/api/tasks/')
        .query({ userId: null })
        .expect(401)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        error: 'No tienes los permisos',
      });
    });
  });
});
