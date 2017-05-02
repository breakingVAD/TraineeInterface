var config = {
    apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
    authDomain: "breaking-vad-online-simulation.firebaseapp.com",
    databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
    storageBucket: "breaking-vad-online-simulation.appspot.com"
};
firebase.initializeApp(config);

var userID = localStorage.getItem('uid');

var storage = firebase.storage();
var databaseRef = firebase.database().ref(userID + '/ProbeData');

databaseRef.on('value',function(snapshot){
    var pathReference = storage.ref('Storage/' + userID + '/' + snapshot.val().region + '.gif');

    pathReference.getDownloadURL().then(function(url) {
        var img = document.getElementById('image');
        img.src = url;
    }).catch(function(error){
        var defaultRef = storage.ref('Storage/' + snapshot.val().region + ".gif");
        defaultRef.getDownloadURL().then(function(url) {
            var img = document.getElementById('image');
            img.src = url;
        }).catch(function(error){
            console.log(error);
        });
    });
});

function backToLVAD() {
    window.location = "../mockLvadDisplay.html";
}
