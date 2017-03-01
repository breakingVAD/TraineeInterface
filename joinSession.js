// Initialize Firebase
var config = {
    apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
    authDomain: "breaking-vad-online-simulation.firebaseapp.com",
    databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
    storageBucket: "breaking-vad-online-simulation.appspot.com"
};
firebase.initializeApp(config);

var userIds = firebase.database().ref('Users Map/');

function joinSession() {
    userIds.once('value', function(snapshot) {
        var usersMap = snapshot.val();
        var email = document.getElementById('email').value;
        var valid = false;
        var userId;

        for (var uid in usersMap) {
            if(email === usersMap[uid].email) {
                valid = true;
                userId = uid;
            }
        }
        if (!valid) {
            document.getElementById('result').innerHTML = email + ' is not a valid instructor email address or this instructor is not currently logged in.'
            document.getElementById('result').style = 'color:red';
        } else {
            localStorage.setItem('uid', userId);
            window.location = 'mockLvadDisplay.html';
        }
    });
}
