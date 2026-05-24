import { UsuarioGithub } from "../models/usuarioGithub";

export class UsuarioGithubValidator {
    static validate(value: unknown): UsuarioGithub {
        if (!this.isObject(value)) {
            throw new Error("Type error");
        }

        if (!("login" in value)) {
            throw new Error("Type error");
        }

        if (!("id" in value)) {
            throw new Error("Type error");
        }

        if (!("name" in value)) {
            throw new Error("Type error");
        }
        
        if (!this.isString(value.id)){
            throw new Error("Type error"); 
        }

        if (!this.isString(value.login)){
            throw new Error("Type error"); 
        }

        
        if (value.name !== null) {
            if (!this.isString(value.name)){
                throw new Error("Type error"); 
            }
        }
        
        if (value.name === null || value.name.trim() === "") {
            throw new Error("Um nome de usuário deve ser informado.");
        }

        const usuarioRegex = /^(?!.*--)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
        if (!usuarioRegex.test(value.name)) {
            throw new Error("Nome de usuário inválido.");
        }
        
        return new UsuarioGithub(value.id, value.login, value.name );
    }

    private static isObject(value: unknown): value is object {//se a função é verdadeira então é objeto
        return typeof value === "object" && value !== null // !value = não nulo
    }

    private static isString(value : unknown) {
        return typeof value === "string"
    }
}