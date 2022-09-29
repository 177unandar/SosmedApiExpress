import { LIMIT_PER_PAGE } from "../config/vars.config";
import { PaginationResponse } from "../models/PaginationResponse";
import { TotalRow } from "../models/TotalRow";
import { executeQuery } from "./mysql.connector";

export class QueryBuilder {
    tableName: string;
    columns: string[] = [];
    joinRaws: string[] = [];
    whereRaws: string[] = [];
    params: string[] = [];
    orderByRaw: string | undefined;
    limit: number | undefined;
    offset: number | undefined;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    select(columns: string[]): QueryBuilder {
        this.columns = columns;
        return this;
    }

    join(...args: string[]): QueryBuilder {
        if (args.length == 3) {
            this.joinRaws.push(`JOIN ${args[0]} ON ${args[1]} = ${args[2]}`)
        } else if (args.length > 3) {
            this.joinRaws.push(`${args[0]} JOIN ${args[1]} ON ${args[2]} = ${args[3]}`)
        }
        return this
    }

    leftJoin(...args: string[]): QueryBuilder {
        return this.join('left', args[0], args[1], args[2])
    }

    whereRaw(arg: string): QueryBuilder {
        this.whereRaws.push(arg)
        return this;
    }

    where(...args: any[]): QueryBuilder {
        if (args.length == 2) {
            this.whereRaws.push(`${args[0]} = ?`);
            this.params.push(args[1]);
        }
        return this;
    }

    orderBy(...args: string[]): QueryBuilder {
        let type = "ASC";
        if (args.length == 2) {
            type = args[1];
        }
        this.orderByRaw = `${args[0]} ${type}`
        return this;
    }

    async get<T>(select: string | undefined = undefined): Promise<T[]> {
        if (select == undefined)
            select = this.columns.length ? this.columns.join(", ") : "*"
        let query = `SELECT ${select} FROM ${this.tableName}`;
        if (this.joinRaws.length) {
            query += ` ${this.joinRaws.join(' ')}`;
        }
        if (this.whereRaws.length) {
            query += ` WHERE ${this.whereRaws.join(' AND')}`;
        }
        if (this.orderByRaw!!) {
            query += ` ORDER BY ${this.orderByRaw}`
        }
        if (this.limit) {
            query += ` LIMIT ${this.limit}`
            if (this.offset) {
                query += ` OFFSET ${this.offset}`
            }
        }
        return await executeQuery<T[]>(query, this.params);
    }

    async first<T>(select: string | undefined = undefined): Promise<T | undefined> {
        let datas: T[] = await this.get<T>(select);
        if (datas!! && datas.length)
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

    async paginate<T>(page: number) {
        let totalRow: TotalRow | undefined = await this.first<TotalRow>("COUNT(*) as total");
        let totalRows = totalRow!! ? totalRow.total : 0;
        let totalPages = 0
        let prevPage: number | null = null;
        let nextPage: number | null = null;
        let data: T[] = []
        if (totalRows > 0) {
            this.limit = LIMIT_PER_PAGE;
            totalPages = Math.ceil((totalRows / this.limit))
            if (page > 1)
                prevPage = page - 1;
            if (page < totalPages)
                nextPage = page + 1;
            this.offset = ((page - 1) * this.limit)
            data = await this.get<T>();
        }
        return new PaginationResponse(totalRows, totalPages, page, prevPage, nextPage, data);
    }

}