window.onload = function () {
    var config = {
        apiKey: "AIzaSyBrWgZydM8om1QiA2IXkGJeGqtEK_Y1ScE",
        authDomain: "breakingvad-77ea2.firebaseapp.com",
        databaseURL: "https://breakingvad-77ea2.firebaseio.com",
        storageBucket: "breakingvad-77ea2.appspot.com",
        messagingSenderId: "1080543855356"
    };
    firebase.initializeApp(config);

    var alarms = firebase.database().ref("alarmLog");
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
        var entryKeys = Object.keys(alarmEntries);
        for(var entryKey in alarmEntries) {
            entry = alarmEntries[entryKey];
            sortedAlarms.push([entry, moment(entry['date'] + ',' + entry['onset'])]);
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
        }
    });

};
