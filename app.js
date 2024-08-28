const express = require('express')
const app = express()
const { body, validationResult } = require('express-validator');
const usersRouter = require('./routes/usersRouter');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/', usersRouter)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})