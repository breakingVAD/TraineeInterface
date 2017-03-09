var config = {
  apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
  authDomain: "breaking-vad-online-simulation.firebaseapp.com",
  databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
  storageBucket: "breaking-vad-online-simulation.appspot.com",
};

firebase.initializeApp(config);
var userID = localStorage.getItem('userid');

function Alarm(line1, lowercase, line2, color) {
    this.line1 = line1;
    this.line2 = line2;
    this.color = color;
    this.lowercase = lowercase;
}

function sendToTrainee(){

  var activeAlarm = firebase.database().ref(userID + "/Active Alarms");
  var values = firebase.database().ref(userID + "/values");
  var alarmTypes = {
      vadStopped1: new Alarm('VAD STOPPED', 'VAD Stopped', 'Connect Driveline', 'red'),
      vadStopped2: new Alarm('VAD STOPPED', 'VAD Stopped','Change Controller', 'red'),
      controlFailed: new Alarm('CONTROLLER FAILED','Controller Failed', 'Change Controller', 'red'),
      critBat1: new Alarm('CRITICAL BATTERY 1', 'Critical Battery 1','Replace Battery 1', 'red'),
      critBat2: new Alarm('CRITICAL BATTERY 2', 'Critical Battery 2','Replace Battery 2', 'red'),
      highWatts: new Alarm('HIGH WATTS', 'High Watts','Call', 'yellow'),
      elecFault: new Alarm('ELECTRICAL FAULT', 'Electrical Fault','Call', 'yellow'),
      lowFlow: new Alarm('LOW FLOW', 'Low Flow','Call', 'yellow'),
      suction: new Alarm('SUCTION', 'Suction','Call', 'yellow'),
      controlFault1: new Alarm('CONTROLLER FAULT','Controller Fault', 'Call', 'yellow'),
      controlFault2: new Alarm('CONTROLLER FAULT','Controller Fault', 'Call: ALARMS OFF', 'yellow'),
      lowBat1: new Alarm('LOW BATTERY 1', 'Low Battery 1','Replace Battery 1', 'yellow'),
      lowBat2: new Alarm('LOW BATTERY 2', 'Low Battery 2','Replace Battery 2', 'yellow'),
      powerDisconnect1: new Alarm('POWER DISCONNECT', 'Power Disconnect','Reconnect Power 1', 'yellow'),
      powerDisconnect2: new Alarm('POWER DISCONNECT', 'Power Disconnect','Reconnect Power 2', 'yellow')
  };
  var alarmType = document.getElementById("activeAlarm").value;
  var alarm = alarmTypes[alarmType];
  activeAlarm.set({
    alarm: alarm
  });
  var  sortedAlarms = [];
  var columns = ['alarm','rpm','Lmin','watts'];
  activeAlarm.on('value', function(snapshot) {
      for(var j=0; j<sortedAlarms.length; j++) {
          document.getElementById('alarmTable').deleteRow(0);
      }
      var alarmObject = snapshot.val();
      var table2 = document.getElementById("alarmTable2");
      alert(table2);
      var row; var cell; var entry;
      var name = alarmObject.alarm.lowercase;
      console.log(name);
      var date = moment(new Date());
      var entry = {
        alarm: name,
        Lmin: 0,
        rpm: 0,
        watts: 0,
        date: date.format('MM/DD/YY'),
        onset: date.format('HH:mm:ss'),
        resolved: "--"
      };
      values.once('value', function(snapshot){
        var output = snapshot.val();
        entry.Lmin = output.flowrate;
        entry.rpm = output.RPM;
        entry.watts = output.power;
        var alarmLog = firebase.database().ref(userID + "/alarmLog");
        alarmLog.push(entry);
      });

      row = table2.insertRow(0);
      row.insertCell(0).innerHTML = moment(sortedEntry['date']).format('MM/DD/YY');
      row.insertCell(1).innerHTML = moment(sortedEntry['date'] + ',' + sortedEntry['onset']).format('HH:mm:ss');
      row.insertCell(2).innerHTML = moment(sortedEntry['date'] + ',' + sortedEntry['resolved']).format('HH:mm:ss');
      for(var i=0; i<columns.length; i++) {
          row.insertCell(i+3).innerHTML = sortedEntry[columns[i]];
      }
      row.insertCell(7).innerHTML = '\<button style="color:white; background-color:grey" onclick="deleteEntry(\'' + sortedEntry.dbKey + '\'\)">x</button>';
  });
}
function createButton(presetName){
var btn = document.createElement("BUTTON");
var t = document.createTextNode(presetName);
btn.appendChild(t);
document.body.appendChild(btn);
btn.setAttribute("id",presetName);
$("#" + presetName).click(function(){
  var sortedAlarms = [];
  var columns = ['alarm','rpm','Lmin','watts'];
  var name = firebase.database().ref(userID + "/Saved Alarms/"+presetName);
  var alarmLog = firebase.database().ref(userID + "/alarmLog");
  alarmLog.remove();
  name.once('value', function(snapshot) {
      var output = snapshot.val();
      var alarmKeys = Object.keys(output);
      for(var alarmKey in output) {
          entry = output[alarmKey];
          entry.dbKey = alarmKey;
          sortedAlarms.push([entry, moment(entry['date'] + ',' + entry['onset'])]);
          alarmLog.push({
            date: entry['date'],
            onset: entry['onset'],
            resolved: entry['resolved'],
            alarm: entry['alarm'],
            rpm: entry['rpm'],
            Lmin: entry['Lmin'],
            watts: entry['watts']
          })
          console.log(sortedAlarms);
      }
      sortedAlarms.sort(function(a,b) {
          a = moment(a[1]);
          b = moment(b[1]);
          return a.diff(b);
      });
      for(var index in sortedAlarms) {
          var sortedEntry = sortedAlarms[index][0];
          row = table.insertRow(0);
          row.insertCell(0).innerHTML = moment(sortedEntry['date']).format('MM/DD/YY');
          row.insertCell(1).innerHTML = moment(sortedEntry['date'] + ',' + sortedEntry['onset']).format('HH:mm:ss');
          row.insertCell(2).innerHTML = moment(sortedEntry['date'] + ',' + sortedEntry['resolved']).format('HH:mm:ss');
          for(var i=0; i<columns.length; i++) {
              row.insertCell(i+3).innerHTML = sortedEntry[columns[i]];
          }
          row.insertCell(7).innerHTML = '\<button style="color:white; background-color:grey" onclick="deleteEntry(\'' + sortedEntry.dbKey + '\'\)">x</button>';
      }

  });

});
//alert("stuff");
var divider = document.createElement("div");
divider.setAttribute("id","styleOfDeleteBtn");
var deleteButton = document.createElement("BUTTON");
var node = document.createTextNode("DELETE");
deleteButton.appendChild(node);
divider.appendChild(deleteButton);

document.body.appendChild(divider);
deleteButton.setAttribute("id","id"+presetName);
deleteButton.setAttribute("class","deleteButtonStyle");

$("#id"+presetName).click(function(){
    var values = firebase.database().ref(userID + "/Saved Alarms/"+presetName);
    values.remove();
    var elem = document.getElementById(presetName);
    elem.parentNode.removeChild(elem);
    var elem2 = document.querySelectorAll("#id"+presetName)[0];
    elem2.parentNode.removeChild(elem2);
});
}


function buttonAction2(){
var value = firebase.database().ref(userID +"/alarmLog");
var presetName = $('#alarmName').val();
if(presetName == ""){
  alert("Name cannot be blank!");
  return;
}
value.once('value',function(snapshot){
    var output = snapshot.val();
    var values = firebase.database().ref(userID +"/Saved Alarms/"+presetName);
    values.remove();
    var alarmKeys = Object.keys(output);
    for(var alarmKey in output) {
      entry = output[alarmKey];
      values.push({
        name: "alarm "+presetName,
        date: entry['date'],
        onset: entry['onset'],
        resolved: entry['resolved'],
        alarm: entry['alarm'],
        rpm: entry['rpm'],
        Lmin: entry['Lmin'],
        watts: entry['watts']
      });
    }

});
createButton(presetName);
}
