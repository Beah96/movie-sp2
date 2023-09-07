import e, { Request, Response } from "express";
import { QueryResult } from "pg";
import format from "pg-format";
import { client } from "./database";

const createMovie = async (request : Request, response : Response): Promise<Response>=>{
    const queryString : string = format(`
    INSERT INTO movies 
    (%I)
    VALUES (%L)
    RETURNING *;
    `, Object.keys(request.body),
    Object.values(request.body)
    )

    const queryResult : QueryResult = await client.query(queryString)

    return response.status(201).json(queryResult.rows[0])
}

const movieList = async (request : Request, response : Response): Promise<Response>=>{
    const queryStringByCategory : string = format(`
    SELECT * FROM movies
    WHERE category = $1;
    `)
    const queryResultByCategory : QueryResult = await client.query(queryStringByCategory, [request.query.category])

    if(queryResultByCategory.rowCount > 0){
        return response.status(200).json(queryResultByCategory.rows)
    }
    
    const queryStringComplete : string = `SELECT * FROM movies;`
    const queryResultComplete : QueryResult = await client.query(queryStringComplete)

    return response.status(200).json(queryResultComplete.rows)
}

const getMovieById = (request : Request, response : Response) : Response=>{
    return response.status(200).json(response.locals.foundMovie)
}

const updateMovie = async (request : Request, response : Response): Promise<Response>=>{
    const queryString : string = format(`
        UPDATE movies 
        SET(%I) = ROW(%L)
        WHERE id = $1
        RETURNING *;
    `, Object.keys(request.body),
    Object.values(request.body))

    const queryResult : QueryResult = await client.query(queryString, [request.params.id])


    return response.status(200).json(queryResult.rows[0])
}

const deleteMovie = async (request : Request, response : Response): Promise<Response>=>{
    const queryString : string = `
    DELETE FROM movies WHERE id = $1;
    `
    await client.query(queryString, [request.params.id])

    return response.status(204).json()
}

export { createMovie, movieList, getMovieById, updateMovie, deleteMovie}