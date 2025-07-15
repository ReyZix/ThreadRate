const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/users")



app.listen(3001, () =>{
    console.log("server is running")
})

const User = require('./models/User'); // Create this file

// SIGNUP
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const user = new User({ username, email, password });
    await user.save();
    res.json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: 'Signup error' });
  }
});

// LOGIN
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login error' });
  }
});
