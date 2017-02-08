// Initialize Firebase
var config = {
    apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
    authDomain: "breaking-vad-online-simulation.firebaseapp.com",
    databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
    storageBucket: "breaking-vad-online-simulation.appspot.com"
};
firebase.initializeApp(config);

var userIds = firebase.database().ref('Users/');

function joinSession() {
    userIds.once('value', function(snapshot) {
        var users = snapshot.val();
        var code = document.getElementById('sessionCode').value;
        var validCode = false;

        for (var uid in users) {
            if(code === users[uid].UserID) {
                validCode = true;
            }
        }
        if (!validCode) {
            document.getElementById('result').innerHTML = code + ' is not a valid user code.'
            document.getElementById('result').style = 'color:red';
        } else {
            localStorage.setItem('uid', code);
            window.location = 'mockLvadDisplay.html';
        }
    });
}
