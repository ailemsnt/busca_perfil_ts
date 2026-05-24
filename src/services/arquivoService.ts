import { UsuarioGithub } from "../models/usuarioGithub";
import { readFile, writeFile } from "node:fs/promises";

const URL_DATABASE = `./database.json`;

async function lerArquivo(): Promise<UsuarioGithub[]> {
    try {
        const usuariosText = await readFile(URL_DATABASE, {encoding: "utf-8"});
        return JSON.parse(usuariosText);
    } catch {
        console.error("Arquivo inválido, não foi possível ler os dados.");
        return [];//sem isso, pode gerar erro undefined
    }
}

export async function salvarArquivo(usuario: UsuarioGithub): Promise<void> {    
    const usuarios = await lerArquivo();  

    if (!usuarios) {
		await writeFile(URL_DATABASE, JSON.stringify([usuario]), {
			encoding: "utf-8",
		});
	}
    
    const usuarioExisteArquivo = usuarios.some((usuarioArquivo: UsuarioGithub) => usuarioArquivo.id  === usuario.id); //some faz o equivalente ao FOR
    if (usuarioExisteArquivo) {
        console.log(`Usuário informado "${usuario.username}" já existe e não será gravado no arquivo.`);
        return;
    }       

    usuarios.push(usuario);

    await writeFile(URL_DATABASE, JSON.stringify(usuarios), {
        encoding: "utf-8",
    });
    
    console.log(`Usuário "${usuario.userlogin}" de "${usuario.username ? usuario.username : "-Nome não informado-"}" incluído no arquivo com sucesso!`);
}
