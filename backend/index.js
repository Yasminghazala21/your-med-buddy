const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('./db')

const app = express()

app.use(cors())
app.use(express.json())

const SECRET_KEY = 'your_secret_key_here'

console.log("index.js is being executed")

app.get('/', (req, res) => {
  res.send('Backend is running!')
})

// SIGNUP 
app.post('/signup', (req, res) => {
  const { username, password } = req.body

  const hashedPassword = bcrypt.hashSync(password, 10)

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)'
  db.run(query, [username, hashedPassword], function (err) {
    if (err) {
      console.error(err.message)
      return res.status(500).json({ error: 'Username already taken' })
    }
    res.status(201).json({ message: 'User created successfully' })
  })
})

// LOGIN 
app.post('/login', (req, res) => {
  const { username, password } = req.body

  const query = 'SELECT * FROM users WHERE username = ?'
  db.get(query, [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Something went wrong' })
    }
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: '1h'
    })

    res.json({ message: 'Login successful', token })
  })
})

// Add Medication
app.post('/medications', (req, res) => {
  const { userId, name, dosage, frequency, date } = req.body
  const query = `INSERT INTO medications (user_id, name, dosage, frequency, date) VALUES (?, ?, ?, ?, ?)`

  db.run(query, [userId, name, dosage, frequency, date], function (err) {
    if (err) {
      console.error(err.message)
      return res.status(500).json({ error: 'Could not add medication' })
    }
    res.status(201).json({ message: 'Medication added', medicationId: this.lastID })
  })
})

// Get Medication
app.get('/medications/:userId', (req, res) => {
  const { userId } = req.params
  const query = 'SELECT * FROM medications WHERE user_id = ?'

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error(err.message)
      return res.status(500).json({ error: 'Could not retrieve medications' })
    }
    res.json({ medications: rows })
  })
})

//Mark as Taken
app.put('/medications/:id/mark-taken', (req, res) => {
  const { id } = req.params
  const query = 'UPDATE medications SET taken = 1 WHERE id = ?'

  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update medication status' })
    }
    res.json({ message: 'Medication marked as taken' })
  })
})

// Get All Medications
app.get('/medications/:userId', (req, res) => {
  const { userId } = req.params
  const query = 'SELECT * FROM medications WHERE user_id = ?'

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch medications' })
    res.json({ medications: rows })
  })
})


const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
