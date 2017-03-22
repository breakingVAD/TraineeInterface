window.onload = function () {
  var config = {
    apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
    authDomain: "breaking-vad-online-simulation.firebaseapp.com",
    databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
    storageBucket: "breaking-vad-online-simulation.appspot.com",
  };
    firebase.initializeApp(config);
    var userID = localStorage.getItem('userid');
    var alarms = firebase.database().ref(userID + "/alarmLog");
    var sortedAlarms = [];

    var columns = ['alarm','rpm','Lmin','watts'];

    alarms.on('value', function(snapshot) {
        for(var j=0; j<sortedAlarms.length; j++) {
            document.getElementById('alarmTable').deleteRow(0);
        }
        sortedAlarms = [];
        var alarmEntries = snapshot.val();
        var table = document.getElementById("alarmTable");
        var row; var cell; var entry;
        console.log(alarmEntries);
        for(var entryKey in alarmEntries) {
            entry = alarmEntries[entryKey];
            entry.dbKey = entryKey;
            sortedAlarms.push([entry, moment(entry['date'] + ',' + entry['onset'])]);
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
            row.insertCell(7).innerHTML = '\<button style="color:white;" class="redBtn" onclick="deleteEntry(\'' + sortedEntry.dbKey + '\'\)">x</button>';
        }
    });

};


function deleteEntry(dbKey) {
    var userID = localStorage.getItem('userid');
    firebase.database().ref(userID + "/alarmLog/" + dbKey).remove();
}
