var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ResponderSchema   = new Schema({
    uuid: String,
	name: String,
	surname: String,
	phone: String,
	photo: String,
	gpsLat:String,
	gpsLon:String,
	active: Boolean
});

module.exports = mongoose.model('Responder', ResponderSchema);
