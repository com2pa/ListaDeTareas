const db = require('.');

//forma de agregar table
const createUsersTable = async () => {
  const statement = db.prepare(` 
  
  CREATE TABLE  users (
    user_id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE
  
  )
  `);
  statement.run(); //corriendo la variable y la base de datos
  console.log('tabla de usuarios creada');
};

//forma de agregar table
const createTareasTable = async () => {
  const statement = db.prepare(` 
    
    CREATE TABLE  tasks (
      text_id INTEGER PRIMARY KEY,
      texto TEXT NOT NULL ,      
      user_id INTEGER NOT NULL,
      estado BOOLEAN ,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE

    
    )
    `);
  statement.run(); //corriendo la variable y la base de datos
  console.log('tabla de tareas  creada');
};

const createTables = async () => {
  await createUsersTable();
  await createTareasTable();
};

createTables();
