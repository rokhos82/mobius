////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Global Namespace Variable
////////////////////////////////////////////////////////////////////////////////////////////////////
var mobius = {};
console.log("Setting up mobius namespace");

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
console.log("Setting up mobius.functions namespace");
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
