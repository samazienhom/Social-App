import e from "express";

export interface IError extends Error {
    statusCode: number
}

export class ApplicationError extends Error{
    constructor(message:string,public statusCode:number,opt?:ErrorOptions){
        super(message,opt);
    }
}