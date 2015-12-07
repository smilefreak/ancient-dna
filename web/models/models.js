var UserMeta = require('./User.js'),
    ResultsMeta = require('./Results.js'),
    JobMeta = require('./Job.js'),
    SampleMeta = require('./Sample.js'),
    JobSamplesMeta = require('./JobSamples.js'),
    connection = require('../sequelize.js')

var User = connection.define('users', UserMeta.attributes, UserMeta.options)
var Results = connection.define('job_results', ResultsMeta.attributes, ResultsMeta.options) 
var Job = connection.define('job', JobMeta.attributes, JobMeta.options)
var Sample = connection.define('sample', SampleMeta.attributes, SampleMeta.options)
var JobSamples = connection.define('job_samples', JobSamplesMeta.attributes, JobSamplesMeta.options)

Job.belongsToMany(Sample, { through: JobSamples })
Sample.belongsToMany(Job, { through: JobSamples })
Results.belongsTo(Job, { foreignKey: "id" })

module.exports.User = User
module.exports.Results = Results
module.exports.Job = Job
module.exports.Sample = Sample
module.exports.JobSamples = JobSamples