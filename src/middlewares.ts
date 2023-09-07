import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "./database";

const verifyId = async(
    request : Request,
    response : Response,
    next : NextFunction
): Promise< void | Response>=>{
    const queryString : string = `
    SELECT * FROM movies
    WHERE id = $1;
    `
    const queryResult : QueryResult  = await client.query(queryString, [
        request.params.id
    ])

    if(queryResult.rowCount === 0){
        return response.status(404).json({
            message: "Movie not found!"
          })
    }

    response.locals.foundMovie = queryResult.rows[0]

    return next()
}

const verifyName = async(
    request : Request,
    response : Response,
    next : NextFunction
): Promise< void | Response>=>{

    const queryString : string = `
    SELECT * FROM movies
    WHERE name = $1;
    `
    const queryResult : QueryResult = await client.query(queryString,[request.body.name])

    if(queryResult.rowCount > 0){
        return response.status(409).json({
            message: "Movie name already exists!"
          })
    }


    return next()
}

export {verifyId, verifyName}