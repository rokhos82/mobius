mobius.facilities = {};

mobius.facilities.types = {
  "research": "research",
  "industry": "industry"
};

mobius.facilities.research = function(options) {
  var $facility = this;
  $facility.uuid = mobius.functions.uuid();
  _.defaults($facility,mobius.facilities.research.default);
};

mobius.facilities.research.default = {
  "type": mobius.facilities.types["research"],
  "location": "some physical location for this facility"
};
