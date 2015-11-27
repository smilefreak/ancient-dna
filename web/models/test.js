var Model = require('./models.js')
Model.Results.findOne({where: { job_id: 9001 } }).then(function(results){
    console.log(results);
    if(results){
        console.log(results.dataValues.files.bams);
    }
});