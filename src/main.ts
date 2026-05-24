import { stdin , stdout } from "process";
import { createInterface } from "node:readline/promises";
import { UsuarioGithubValidator } from "./validators/usuarioGithubValidator";
import { buscarPerfil } from "./services/githubService";
import { salvarArquivo } from "./services/arquivoService"; 

async function main(): Promise<void>{
    const interfaceConsole = createInterface({input: stdin, output: stdout});

    try {
        console.log("\n________________________\n ");
        console.log(  "BUSCA DE USUÁRIOS GITHUB   ");
        console.log("\n________________________\n ");

        const respostaOperacao = await interfaceConsole.question("Digite o nome do usuário no GITHUB:\n");

        const usuarioValidado = UsuarioGithubValidator.validate(respostaOperacao);
        
        const usuario = await buscarPerfil(usuarioValidado.userlogin);   
        
        const respostaGravar = await interfaceConsole.question(`Usuário "${usuario.userlogin}" encontrado no Github. Deseja gravá-lo no arquivo? (Digite: S ou N):\n`);

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