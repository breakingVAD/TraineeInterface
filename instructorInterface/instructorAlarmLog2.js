var userID = localStorage.getItem('userid');
var keyName;
window.onload = function () {
  var config = {
    apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
    authDomain: "breaking-vad-online-simulation.firebaseapp.com",
    databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
    storageBucket: "breaking-vad-online-simulation.appspot.com",
  };
    firebase.initializeApp(config);
    var userID = localStorage.getItem('userid');
    var activeAlarm = firebase.database().ref(userID + "/Active Alarms");
    var values = firebase.database().ref(userID + "/values");
    var columns = ['alarm','rpm','Lmin','watts'];
    activeAlarm.on('value', function(snapshot) {
      var alarmObject = snapshot.val();
        if (alarmObject!= null){
          var table = document.getElementById('alarmTable2');
          var row; var cell; var entry;
          var name = alarmObject.alarm.lowercase;
          row = table.insertRow(0);
          row.insertCell(0).innerHTML = name;
          row.insertCell(1).innerHTML = '\<button style="color:white; background-color:grey" onclick="deleteEntry()">x</button>';
      }
    });

    var ref = firebase.database().ref(userID + "/alarmLog");
    ref.on('child_added',function(snapshot){
      var alarm = snapshot.val();
      keyName = snapshot.key;
    });

};

function deleteEntry() {
    firebase.database().ref(userID + "/Active Alarms").remove();
    var ref = firebase.database().ref(userID + "/alarmLog");
    var date = moment(new Date());
    ref.once('value',function(snapshot){
      var alarms = snapshot.val();
      for(var alarmkey in alarms){
        if (alarmkey === keyName){
          var entry = alarms[alarmkey];
          var keyref = firebase.database().ref(userID + "/alarmLog/"+keyName);
          keyref.update({
            alarm: entry.alarm,
            Lmin: entry.Lmin,
            rpm: entry.rpm,
            watts: entry.watts,
            date: entry.date,
            onset: entry.onset,
            resolved: date.format('HH:mm:ss')
          });
        }
      }
    });
    var table = document.getElementById('alarmTable2');
    var cells = table.rows[0].cells;

    table.deleteRow(0);

}
