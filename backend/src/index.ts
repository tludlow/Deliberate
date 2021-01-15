import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'

//Load environment variables
require('dotenv').config()

//Create an express instance
const app = express()

//Import controllers
import * as apiController from './controllers/api'
import * as authController from './controllers/auth'
import * as ssoController from './controllers/sso'
import * as teamController from './controllers/team'
import * as userController from './controllers/user'

//Midleware
import { AuthTokenMiddleware } from './middleware/authMiddleware'
import { IsTeamMember } from './middleware/teamPermissionsMiddleware'
import { HasPermission } from './middleware/teamPermissionsMiddleware'

//Setup api middlewares
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }))

//Mount routes to the api
app.get('/ping', apiController.Ping)

//Auth
app.post('/user/login', authController.Login)
app.post('/user/register', authController.Signup)

//SSO
app.get('/auth/github', ssoController.GithubSSO)

//Teams
app.post('/team/create', AuthTokenMiddleware, teamController.Create)
app.get(
    '/team/:teamName',
    [AuthTokenMiddleware, IsTeamMember, HasPermission('REGULAR')],
    teamController.TeamInformation
)
app.post(
    '/team/:teamName/permission',
    [AuthTokenMiddleware, IsTeamMember, HasPermission('ADMIN')],
    teamController.ChangeTeamMemberPermission
)

//User
app.get('/user/dashboard', AuthTokenMiddleware, userController.Dashboard)

//Catch all 404
app.get('/*', apiController.FourOFour)

export default app
