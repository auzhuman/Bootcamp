const { count } = require("../models/Bootcamp");

const advancedResults = (models,populate) => async(req,res,next) =>{
    let query;
    // make a copy of reqquery
    const reqQuery = {...req.query}


    //remove fields
    const removeFields = ["select","sort","page","limit"]

    //loop remove fields to delete the fields
    removeFields.forEach(param => delete reqQuery[param]);


    //create query string
    let queryStr = JSON.stringify(reqQuery);

    // create operators like gte nad all
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`)
    
    //find from bootcamp
    query = models.find(JSON.parse(queryStr)).populate(populate);
    
    //select fields
    if (req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    //sort by query
    if (req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else {
        query = query.sort('-createdAt')
    }

    // pagination
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt (req.query.limit,10) || 25 ;
    const startIndex= (page - 1 )* limit;
    const endIndex = page * limit;
    const total = await models.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (populate){
        query = query.populate(populate)
    }
    //execution 
        const results = await query;

    //pagination result
        const pagination = {};
        if(endIndex < total){
            pagination.next =  {
                page : page + 1,
                limit : limit

            }
        }
        if(startIndex > 0 ){
            pagination.prev = {
                page : page -1,
                limit
            }
        }
    res.advancedResults = {
        success : true,
        count : results.length, 
        pagination,
        data : results
    }
    next()
};



module.exports = advancedResults;