var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AreaSchema   = new Schema({
    area: String,
	code: Number,
	parent: Number
});

module.exports = mongoose.model('Area', AreaSchema);
