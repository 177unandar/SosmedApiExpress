export class User {
    username: string;
    fullname: string;
    password: string;
    created_at: string;

    constructor(username: string, fullname: string, password: string, created_at: string) {
        this.username = username;
        this.fullname = fullname;
        this.password = password;
        this.created_at = created_at;
    }
}