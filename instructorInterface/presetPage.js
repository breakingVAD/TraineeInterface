var config = {
    apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
    authDomain: "breaking-vad-online-simulation.firebaseapp.com",
    databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
    storageBucket: "breaking-vad-online-simulation.appspot.com",
};

firebase.initializeApp(config);
var userID;
firebase.auth().onAuthStateChanged(function(firebaseUser) {
    if(firebaseUser){
        console.log("Still logged in");
        userID=firebaseUser.uid;
    } else {
        console.log("Not Logged In -- ");
        window.location='../index.html';
    }
});
var users=firebase.database().ref("Users");
var usersMap=firebase.database().ref("Users Map");

function logout(){
    console.log("Button Clicked");
    users.set({
        random: true
    });
    users.once('value').then(function(snapshot) {
        var output=snapshot.val();
        for(var key in output) {
            var id=output[key];
            if(id['UserID'] == userID){
                var userRef=firebase.database().ref("Users/" + key);
                userRef.remove();
            }
        }
    });
    usersMap.once('value').then(function(snapshot) {
        var output=snapshot.val();
        for(var key in output) {
            if(key == userID){
                var userRef=firebase.database().ref("Users Map/" + key);
                userRef.remove();
            }
        }
    });
    firebase.auth().signOut();
}