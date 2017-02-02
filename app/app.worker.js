var fleets = undefined;

self.onmessage = function(event) {
	fleets = event.data;
	self.postMessage(fleets);
};