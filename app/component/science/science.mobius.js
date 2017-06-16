////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Science Namespace
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.science = {};

// Science Events
mobius.science.events = {};
mobius.science.events.dirty = "mobius.science.events.dirty";

mobius.science.project = function(name,description,stage,bonus) {
  this.name = name;
  this.description = description;
  this.stage = stage;
  this.bonus = bonus;
  this.funding = 0;
  this.prevFunding = 0;
  this.totalFunding = 0;
};

mobius.science.project.stages = [
  {name:"Discovery",index:0,next:1},
  {name:"Reserach",index:1,next:2},
  {name:"Development",index:2,next:3},
  {name:"Completed",index:3,fin:true}
];
