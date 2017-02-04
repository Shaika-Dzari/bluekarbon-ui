function PagingParam(page, size) {
    this.page = page || 0;
    this.size = size || 10;
}

PagingParam.prototype.getPage = function() {
    return this.page;
}

PagingParam.prototype.getSize = function() {
    return this.size;
}

PagingParam.prototype.equals = function(other) {
    if (!other) {
        return true;
    }

    return this.page == other.page && this.size == other.size;
}

export default PagingParam;