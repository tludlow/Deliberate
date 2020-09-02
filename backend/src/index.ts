import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'

//Create an express instance
const app = express()

//Setup the database connection

//Import controllers
import * as apiController from './controllers/api'

//Setup api middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }))

//Mount routes to the api
app.get('/ping', apiController.Ping)

export default app
