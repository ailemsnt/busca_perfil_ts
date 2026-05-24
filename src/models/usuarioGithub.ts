export class UsuarioGithub {
    constructor(
        public id: string,
        private login: string,
        private name: string | null
    ){
    }

    get username(): string | null {
        return this.name;
    }

    get userlogin(): string {
        return this.login;
    }
}