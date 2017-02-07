function Alarm(line1, line2, color) {
    this.line1 = line1;
    this.line2 = line2;
    this.color = color;
}

var alarms = {vadStoppedD: new Alarm('VAD STOPPED', 'Connect Driveline', 'red'),
    vadStoppedC: new Alarm('VAD STOPPED', 'Change Controller', 'red'),
    controlFailed: new Alarm('CONTROLLER FAILED', 'Change Controller', 'red'),
    critBat1: new Alarm('CRITICAL BATTERY 1', 'Replace Battery 1', 'red'),
    critBat2: new Alarm('CRITICAL BATTERY 2', 'Replace Battery 2', 'red'),
    highWatts: new Alarm('HIGH WATTS', 'Call', 'yellow'),
    elecFault: new Alarm('ELECTRICAL FAULT', 'Call', 'yellow'),
    lowFlow: new Alarm('LOW FLOW', 'Call', 'yellow'),
    suction: new Alarm('SUCTION', 'Call', 'yellow'),
    controlFault: new Alarm('CONTROLLER FAULT', 'Call', 'yellow'),
    controlFaultOFF: new Alarm('CONTROLLER FAULT', 'Call: ALARMS OFF', 'yellow'),
    lowBat1: new Alarm('LOW BATTERY 1', 'Replace Battery 1', 'yellow'),
    lowBat2: new Alarm('LOW BATTERY 2', 'Replace Battery 2', 'yellow'),
    powerDisconnect1: new Alarm('POWER DISCONNECT', 'Reconnect Power 1', 'yellow'),
    powerDisconnect2: new Alarm('POWER DISCONNECT', 'Reconnect Power 2', 'yellow')
};

window.onload = function () {
    var config = {
        apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
        authDomain: "breaking-vad-online-simulation.firebaseapp.com",
        databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
        storageBucket: "breaking-vad-online-simulation.appspot.com"
    };
    firebase.initializeApp(config);
    var uid = localStorage.getItem('uid');
    var alarms = firebase.database().ref(uid + "/activeAlarm");
    alarms.on('value', function(snapshot) {
        var activeAlarm = snapshot.val();
        //how to check if there's anything there??
        document.getElementById('alarmLine1').innerHTML = activeAlarm.line1;
        document.getElementById('alarmLine2').innerHTML = activeAlarm.line2;
        document.getElementById('alarmBanner').style.visibility = 'visible';
    });
    //TODO: Do you we want it to make a noise?

};

function silenceAlarm() {
    setTimeout(function () {
        //TODO: restart alarm after 5 minutes?
    }, 300000);
}