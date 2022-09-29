import { Pagination } from "./Pagination";


export class PaginationResponse<T> {
    pagination: Pagination;
    rows: T[];

    constructor(totalRows: number, totalPages: number, currentPage: number, prevPage: number | null, nextPage: number | null, rows: T[]) {
        this.pagination = new Pagination(totalRows, totalPages, currentPage, prevPage, nextPage)
        this.rows = rows;
    }
}