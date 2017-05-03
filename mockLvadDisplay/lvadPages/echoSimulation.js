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
    var pathReference = storage.ref('Storage/' + userID + '/' + snapshot.val().region);
    console.log('Storage/' + userID + '/' + snapshot.val().region);

    pathReference.getDownloadURL().then(function(url) {
        var vid = document.getElementById('video');
        var source = document.getElementById('source');
        source.src = url;
        console.log(url);
        vid.load();
        vid.play();
    }).catch(function(error){
        var defaultRef = storage.ref('Storage/' + snapshot.val().region + '.mp4');
        defaultRef.getDownloadURL().then(function(url) {
            var vid = document.getElementById('video');
            var source = document.getElementById('source');
            source.src = url;
            console.log(url);
            vid.load();
            vid.play();
        }).catch(function(error){
            console.log(error);
        });
    });
});

