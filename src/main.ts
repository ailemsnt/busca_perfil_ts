import { stdin , stdout } from "process";
import { createInterface } from "node:readline/promises";
import { readFile, writeFile } from "node:fs/promises";

interface Usuario {
    id: number;
    login: string;
    name: string | null;
}

const URL_DATABASE = `./database.json`;

function validaUsuario(nomeUsuario: string): string {
    nomeUsuario = nomeUsuario.trim();

    if (nomeUsuario === "") {
        throw new Error("Um nome de usuário deve ser informado.");
    }

    const usuarioRegex = /^(?!.*--)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
    if (!usuarioRegex.test(nomeUsuario)) {
        throw new Error("Nome de usuário inválido.");
    }

    return nomeUsuario
}

async function buscarPerfil(username: string): Promise<Usuario>{
    const urlBase = 'https://api.github.com/users/';
    
    try {
        
        const response = await fetch(`${urlBase}${username}`)

        switch (response.status) {
            case 200:
                return await response.json();
            case 400:
                throw new Error ('Requisição inválida');   
            case 404:
                throw new Error (`Usuário "${username}" não encontrado no Github`);  
            default:
                throw new Error (`Não foi possível buscar o usuário no Github ${response.status}${response.statusText}`);    
        }        
    
    } catch (error){
        if (error instanceof TypeError) {
            throw new Error("Erro de timeout - falha de conexão com o Github");
        }
        throw error;
    }
}

async function lerArquivo(): Promise<Usuario[]> {
    try {
        const usuariosText = await readFile(URL_DATABASE, {encoding: "utf-8"});
        return JSON.parse(usuariosText);
    } catch {
        console.error("Arquivo inválido, não foi possível ler os dados.");
        return [];//sem isso, pode gerar erro undefined
    }
}

async function salvarArquivo(usuario: Usuario): Promise<void> {    
    const usuarios = await lerArquivo();  

    if (!usuarios) {
		await writeFile(URL_DATABASE, JSON.stringify([usuario]), {
			encoding: "utf-8",
		});
	}
    
    const usuarioExisteArquivo = usuarios.some((usuarioArquivo: any) => usuarioArquivo.id  === usuario.id); //some faz o equivalente ao FOR
    if (usuarioExisteArquivo) {
        console.log(`Usuário informado "${usuario.login}" já existe e não será gravado no arquivo.`);
        return;
    }       

    usuarios.push(usuario);

    await writeFile(URL_DATABASE, JSON.stringify(usuarios), {
        encoding: "utf-8",
    });
    
    console.log(`Usuário "${usuario.login}" de "${usuario.name ? usuario.name : "-Nome não informado-"}" incluído no arquivo com sucesso!`);
}

async function main(): Promise<void>{
    const interfaceConsole = createInterface({input: stdin, output: stdout});

    try {
        console.log("\n________________________\n ");
        console.log(  "BUSCA DE USUÁRIOS GITHUB   ");
        console.log("\n________________________\n ");

        const respostaOperacao = await interfaceConsole.question("Digite o nome do usuário no GITHUB:\n");

        const nomeUsuario = validaUsuario(respostaOperacao);
                
        const usuario = await buscarPerfil(nomeUsuario);   
        
        const respostaGravar = await interfaceConsole.question(`Usuário "${usuario.login}" encontrado no Github. Deseja gravá-lo no arquivo? (Digite: S ou N):\n`);

        if (respostaGravar.trim().toUpperCase() !== "S" && respostaGravar.trim().toUpperCase() !== "N") {//somente vai aceitar S ou N, nada mais
            console.log("Você informou uma opção inválida. Operação será finalizada.");
            return;
        }       
        
        await salvarArquivo(usuario);
    
    } catch (error : any) {
        console.log("\nFalha ao realizar o processo: " + error.message);
    } finally {
        interfaceConsole.close();
    }
}

main();

//próximos passos: dividir arquivos em pastas controllers e services