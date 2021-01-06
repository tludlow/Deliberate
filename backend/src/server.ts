import app from './index'
import { Close } from './db'

//Start the server instance
const server = app.listen(5000, () => {
    console.log('server started on port 5000')
})

// process.on('uncaughtException', gracefullyExitProcess)
// process.on('unhandledRejection', gracefullyExitProcess)
// process.on('SIGINT', gracefullyExitProcess)

// async function gracefullyExitProcess() {
//     console.log('closing server gracefully')
//     Close()
//     server.close(() => process.exit())
// }

export default server
