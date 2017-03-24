var config = {
  apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
  authDomain: "breaking-vad-online-simulation.firebaseapp.com",
  databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
  storageBucket: "breaking-vad-online-simulation.appspot.com",
};

firebase.initializeApp(config);

var userID = localStorage.getItem('userid');

var alarmLog = firebase.database().ref(userID + "/alarmLog");

var savedAlarmLogs = firebase.database().ref(userID + "/Saved Alarm Logs");

savedAlarmLogs.on('value',function(snapshot){
    var tables = document.getElementsByClassName("savedALs");
    for (var i=0; i<tables.length; i++) {
        table = tables[i];
        while(table.rows.length>0) {
            table.deleteRow(0);
        }
    }

    var output = snapshot.val();

    var table; var row; var entry; var btn; var deleteButton; var node;
    var tableInd = 0;
    table = tables[0];
    var keyNum = 0;
    for(var key in output){
        keyNum++;
        if (table.rows.length>4) {
            table = tables[++tableInd];
        }
        entry = output[key];
        row = table.insertRow();
        btn = document.createElement("BUTTON");
        btn.innerHTML = key;
        btn.style = "width:100%";
        btn.className = "grayBtn";

        row.insertCell(0).appendChild(btn);

        btn.setAttribute("id",key);
        btn.onclick = useSavedAL;

        deleteButton = document.createElement("BUTTON");
        deleteButton.innerHTML = "x";
        deleteButton.className = "redBtn";
        row.insertCell(1).appendChild(deleteButton);

        deleteButton.setAttribute("id","id"+key);
        deleteButton.setAttribute("onclick", "deleteALFunc(event)");
    }
    if (!keyNum) {
        document.getElementById("savedAlarmLogs").style.visibility = "hidden";
    }
});


function addToLog() {
    alarmLog.push({
        date: $('#date').val(),
        onset: $('#onset').val(),
        resolved: $('#resolved').val(),
        alarm: $('#alarm').val(),
        rpm: $('#rpm').val(),
        Lmin: $('#Lmin').val(),
        watts: $('#watts').val()
    });
}

function clearAllEntries() {
    alarmLog.remove();
}

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
  activeAlarm.once('value', function(snapshot) {
    var alarmObject = snapshot.val();
    if (alarmObject != null){
        var entry;
        var name = alarmObject.alarm.lowercase;
        var date = moment(new Date());
        var entry = {
          alarm: name,
          Lmin: 0,
          rpm: 0,
          watts: 0,
          date: date.format('MM/DD/YY'),
          onset: date.format('HH:mm:ss'),
          resolved: " "
        };
        values.once('value', function(snapshot){
          var output = snapshot.val();
          entry.Lmin = output.flowrate;
          entry.rpm = output.RPM;
          entry.watts = output.power;
          alarmLog.push(entry);
        });
    }

  });
}

function saveAlarmLog(){
    savedAlarmLogs.once('value', function(snapshot) {
        var output = snapshot.val();
        var keys = Object.keys(output);
        if (keys.length < 25) {
            document.getElementById("savedAlarmLogs").style.visibility = "visible";
            var presetName = $('#ALname').val();
            console.log(presetName);
            if (presetName) {
                var nameExists = false;
                for (var key in output) {
                    if (key === presetName) {
                        nameExists = true;
                    }
                }
                if (!nameExists) {
                    var values = firebase.database().ref(userID + "/Saved Alarm Logs/" + presetName);
                    alarmLog.once('value', function(snapshot) {
                        var output = snapshot.val();
                        values.set(output);
                    });
                    document.getElementById('ALname').value = "";
                } else {
                    alert("You already have an Alarm Log saved under this name. Please choose a different name.");
                }
            } else {
                alert("Please input a name before saving your Alarm Log.");
            }
        } else {
            alert("You have the maximum number of Alarm Logs saved. Please delete other saved Alarm Logs before saving a new one.");
        }
    });
}


function useSavedAL(event) {
    var id = event.target.id;
    var name = firebase.database().ref(userID + "/Saved Alarm Logs/" + id);
    name.once('value', function(snapshot) {
        var output = snapshot.val();
        alarmLog.set(output);
    });
}

function deleteALFunc(event){
    var id = event.target.id;
    var key = id.substring(2,id.length);
    var saved = firebase.database().ref(userID + "/Saved Alarm Logs/" + key);
    saved.remove();
}

function deleteAEFunc(event){
    var id = event.target.id;
    var key = id.substring(2,id.length);
    var saved = firebase.database().ref(userID + "/Saved Alarms/" + key);
    saved.remove();
}