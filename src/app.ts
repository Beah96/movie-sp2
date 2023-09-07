import express, { Application, json } from "express"
import { connectDatabase } from "./database"
import { verifyId, verifyName } from "./middlewares"
import { createMovie, deleteMovie, getMovieById, movieList, updateMovie } from "./logic"


const app : Application = express()
app.use(json())
const PORT: number = 3000
const runningMSG : string = `Server running on http://localhost:${PORT}`


app.post('/movies', verifyName, createMovie)
app.get('/movies', movieList)
app.get('/movies/:id', verifyId, getMovieById)
app.patch('/movies/:id', verifyId, verifyName, updateMovie)
app.delete('/movies/:id', verifyId, deleteMovie)

app.listen(PORT, async ()=>{
    await connectDatabase()
    console.log(runningMSG)
})