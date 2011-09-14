steal('ss/controller/state_machine',
function() {

SS.StateMachine.Controller.extend('SS.StateMachine.Controller.SerialCommand',
{
  onDocument: true
},
{
  states: { },
  
  init: function(event_name, params) {
    var commands = EventCommandMap.events_to_commands[event_name];
    
    if (!commands) {
      return;
    }
  
    if (!$.isArray(commands)) {
      commands = [commands];
    }
  
    for (var i = 0; i < commands.length; i++) {
      var stateName = (i === 0) ? "initial" : "command" + i;
      var nextState = commands[i+1] ? "command" + (i+1) : false;
      
      states[stateName] = {
        "nextState": nextState,
        
        onEnter: function() {
          // send run command
          new commands[i](event_name, params);
          this.publish("command.run", {command_classes:[commands[i]], params: params});
          
          // send next event
          if (nextState) {
            this.publishState("nextState");
          }
        }
      };
    }
      
    this._super(document.body);
  }
}
);

});