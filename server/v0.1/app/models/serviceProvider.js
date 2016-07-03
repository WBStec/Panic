var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ServiceProviderSchema   = new Schema({
	login: String, 
	password: String,
	role: String,
	name: String,
	phone: String,
	active: Boolean,
	areas: Array
});

module.exports = mongoose.model('ServiceProviderSchema', ServiceProviderSchema);
