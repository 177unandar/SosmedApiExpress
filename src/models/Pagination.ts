

export class Pagination {
    totalRows: number;
    totalPages: number;
    currentPage: number;
    prevPage: number | null;
    nextPage: number | null;

    constructor(totalRows: number, totalPages: number, currentPage: number, prevPage: number | null, nextPage: number | null) {
        this.totalRows = totalRows;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.prevPage = prevPage;
        this.nextPage = nextPage;
    }
}