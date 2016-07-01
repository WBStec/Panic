var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AlarmSchema   = new Schema({
	alarmDate: Date,
	closeDate: Date,
	uuid: String,
	gpsLat: String,
	gpsLon: String,
	serviceProvider: String,
	state: String
	
});

module.exports = mongoose.model('Alarm', AlarmSchema);
