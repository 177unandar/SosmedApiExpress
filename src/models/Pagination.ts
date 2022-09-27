

export class Pagination<T> {
    totalRows: number;
    totalPages: number;
    currentPage: number;
    prevPage: number | null;
    nextPage: number | null;
    rows: T[];

    constructor(totalRows: number, totalPages: number, currentPage: number, prevPage: number | null, nextPage: number | null, rows: T[]) {
        this.totalRows = totalRows;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.prevPage = prevPage;
        this.nextPage = nextPage;
        this.rows = rows;
    }
}