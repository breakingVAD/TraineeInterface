window.onload = function () {
    var config = {
        apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
        authDomain: "breaking-vad-online-simulation.firebaseapp.com",
        databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
        storageBucket: "breaking-vad-online-simulation.appspot.com"
    };
    firebase.initializeApp(config);
    var uid = localStorage.getItem('uid');
    var alarms = firebase.database().ref(uid + "/Active Alarms");
    alarms.on('value', function(snapshot) {
        var activeAlarm = snapshot.val();
        if (activeAlarm) {
            var key = Object.keys(activeAlarm)[0];
            document.getElementById('alarmLine1').innerHTML = activeAlarm[key].line1;
            document.getElementById('alarmLine1').style.color = activeAlarm[key].color;
            document.getElementById('alarmLine2').innerHTML = activeAlarm[key].line2;
            document.getElementById('alarmLine2').style.color = activeAlarm[key].color;
            document.getElementById('bell').src = '../images/' + activeAlarm[key].color + 'AlarmBell.png';
            document.getElementById('alarmBanner').style.visibility = 'visible';
            document.getElementById('alarmNoise').muted = false;
            //http://www.audiocheck.net/audiocheck_dtmf.php <-- this is where I made the alarm noise file
        } else {
            document.getElementById('alarmBanner').style.visibility = 'hidden';
            document.getElementById('alarmNoise').muted = true;
        }
    });
};

function silenceAlarm() {
    document.getElementById('alarmNoise').muted = true;
}