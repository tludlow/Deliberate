import app from './index'

//Start the server instance
const server = app.listen(5000, () => {
    console.log('server started on port 5000')
})

export default server
