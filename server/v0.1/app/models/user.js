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
	area:String,
	gpsLat:String,
	gpsLon:String,
	active: Boolean,
	medical:String,
	sms1:String,
	sms2:String
});

module.exports = mongoose.model('User', UserSchema);
