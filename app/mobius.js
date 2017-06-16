////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Global Namespace Variable
////////////////////////////////////////////////////////////////////////////////////////////////////
var mobius = {};

////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Defaults
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.defaults = {};
mobius.defaults.alert = {
	msg: "",
	type: "warning",
	timeout: undefined
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Templates
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.templates = {};

// Bootstrap UI Alert Template /////////////////////////////////////////////////////////////////////
mobius.templates.alert = function(msg,type,timeout) {
	var alert = this;
	alert.msg = msg;
	alert.type = type;
	alert.timeout = timeout;
	_.defaults(alert,mobius.defaults.alert);
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Helper Functions
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.functions = {};
mobius.functions.arrayToString = function(arr,html) {
	let result = "";
	for(let i in arr) {
		const str = arr[i].toString();
		if(typeof html ==="string") {
			result += "<" + html + ">" + str + "</" + html + ">";
		}
		else {
			result += str;
		}
	}
	return result;
};

mobius.functions.randBetween = function(low,high,round) {
	var random = Math.random() * (high - low) + low;
	random = round ? Math.floor(random) : random;
	return random;
};

mobius.functions.dieRoll = function(quantity,size) {
	var total = 0;
	for(let i = 0;i < quantity;i++) {
		total += mobius.functions.randBetween(1,size);
	}
	return total;
};
