import { UsuarioGithub } from "../models/usuarioGithub";
import { UsuarioGithubValidator } from "../validators/usuarioGithubValidator";

export async function buscarPerfil(username: string): Promise<UsuarioGithub>{
    const urlBase = 'https://api.github.com/users/';
    
    try {
        
        const response = await fetch(`${urlBase}${username}`)

        switch (response.status) {
            case 200:
                return UsuarioGithubValidator.validate(await response.json());                
            case 400:
                throw new Error ('Requisição inválida');   
            case 404:
                throw new Error (`Usuário "${username}" não encontrado no Github`);  
            default:
                throw new Error (`Não foi possível buscar o usuário no Github ${response.status}${response.statusText}`);    
        }        
    
    } catch (error){
        if (!(error instanceof TypeError)) {
            throw new Error("Falha de conexão com o Github");
        }
        throw error;
    }
}