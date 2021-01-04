import { Pool } from 'pg'
import pg from 'pg'

//Connect to the postgres database in a pool format so we dont need to handshake on each request
// const pool = new Pool({
//     user: 'deliberate',
//     host: 'localhost',
//     port: 5432,
//     database: 'deliberate',
//     password: 'testpassword',
// })
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
})

export const query = (text: string, params: any[]) => pool.query(text, params)
export const Close = () => {
    pool.end()
}
