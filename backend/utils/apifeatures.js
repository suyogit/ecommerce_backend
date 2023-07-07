class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;// this is the query that we are passing in the controller 

        this.queryStr = queryStr;
    }

    search() {

        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i' // case insensitive
            }
        } : {};

        //   console.log(keyword);
        this.query = this.query.find({ ...keyword });// ... means spread operator
        return this;
    }

    filter() {

        const queryCopy = { ...this.queryStr };
        //console.log(queryCopy);
        // Removing fields from the query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(key => delete queryCopy[key]);
        //console.log(queryCopy);
        // Advance filter for price, ratings etc
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);// putting $ sign before the match because we are using mongodb operators

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;

    }
}


module.exports = ApiFeatures;