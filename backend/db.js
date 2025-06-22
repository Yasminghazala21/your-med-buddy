const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.join(__dirname, 'medbuddy.db')
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('Could not connect to database', err)
  } else {
    console.log('Connected to SQLite database')
  }
})

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`)
db.run(`
    CREATE TABLE IF NOT EXISTS medications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT,
      dosage TEXT,
      frequency TEXT,
      date TEXT,
      taken INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `)
  
module.exports = db
