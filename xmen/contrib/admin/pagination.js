class Pagination {
  constructor(count, perPage, currentPage, maxPagesToShow) {
    this.count = count;
    this.perPage = perPage;
    this.currentPage = currentPage;
    this.maxPagesToShow = maxPagesToShow;
    this.pages = [];
    this.totalPages = 1;
    this.hasPrev = false;
    this.hasNext = false;

    this.pages = this.generatePages();
  }

  generatePages() {
    // Total number of pages
    this.totalPages = Math.ceil(this.count / this.perPage);

    let pages = [];

    if (this.totalPages <= 1) {
      return [];
    }

    if (this.totalPages <= this.maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(this.createPage(i, i == this.currentPage));
      }
    } else {
      // Determine the range, centering current page.
      let numAdjacents = Math.floor((this.maxPagesToShow - 1) / 2);
      let slidingStart = this.currentPage - numAdjacents;
      let slidingEnd = slidingStart + this.maxPagesToShow - 1;

      if (this.currentPage + numAdjacents > this.totalPages) {
        slidingStart = this.totalPages - this.maxPagesToShow + 2;
      }

      if (slidingStart < 2) slidingStart = 1;

      if (slidingEnd >= this.totalPages) slidingEnd = this.totalPages;

      for (let i = slidingStart; i <= slidingEnd; i++) {
        pages.push(this.createPage(i, i == this.currentPage));
      }
    }

    if (this.currentPage == 1) {
      this.hasPrev = false;
    } else {
      this.hasPrev = true;
    }

    if (this.currentPage == this.totalPages) {
      this.hasNext = false;
    } else {
      this.hasNext = true;
    }

    return pages;
  }

  createPage(pageNum, isCurrent) {
    return {
      num: pageNum,
      isCurrent: isCurrent
    };
  }
}

module.exports = Pagination;
