var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    uuid: String,
	name: String,
	surname: String,
	phone: String,
	photo: String,
	address: String,
	direction:String,
	serviceProvider:String,
	area:Number,
	active: Boolean
});

module.exports = mongoose.model('User', UserSchema);
