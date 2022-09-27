import { executeQuery } from "./mysql.connector";

export class QueryBuilder {
    tableName: string;
    columns: string[] = [];
    whereRaws: string[] = [];
    params: string[] = [];

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    select(columns: string[]): QueryBuilder {
        this.columns = columns;
        return this;
    }

    whereRaw(arg: string) : QueryBuilder{
        this.whereRaws.push(arg)
        return this;
    }

    where(...args: string[]) : QueryBuilder{
        if(args.length == 2) {
            this.whereRaws.push(`${args[0]} = ?`);
            this.params.push(args[1]);
        }
        return this;
    }

    async get<T>(): Promise<T[]> {
        let select = this.columns.length ? this.columns.join(", ") : "*"
        let query = `SELECT ${select} FROM ${this.tableName}`;
        if(this.whereRaws.length) {
            query += ` WHERE ${this.whereRaws.join(' AND')}`;
        }
        console.log("query get", query)
        return await executeQuery<T[]>(query, this.params);
    }

    async first<T>(): Promise<T | undefined> {
        let datas: T[] = await this.get<T>();
        if(datas!! && datas.length)
            return datas[0];
        return undefined;
    }

    async insert(obj: object) {
        let columns: string[] = [];
        let values: string[] = [];
        let params: string[] = [];
        Object.entries(obj).forEach(
            ([key, value]) => {
                columns.push(key)
                values.push("?")
                params.push(value)
            }
          );
        let query = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${values.join(', ')}) `;
        await executeQuery<any>(query, params);
    }

}