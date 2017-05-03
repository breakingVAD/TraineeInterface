var userID; var probeData;
window.onload = function() {
    var config = {
        apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
        authDomain: "breaking-vad-online-simulation.firebaseapp.com",
        databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
        storageBucket: "breaking-vad-online-simulation.appspot.com",
    };

    firebase.initializeApp(config);

    userID = localStorage.getItem('userid');
    console.log(userID);
    probeData = firebase.database().ref(userID + "/ProbeData/");

    var fileUploaders = document.getElementsByClassName("imageUpload");
    console.log(fileUploaders);
    for (var i=0; i<fileUploaders.length; i++) {
        fileUploaders[i].addEventListener('change', upload);
    }
};

var userID = localStorage.getItem('userid');

function upload(e) {
    console.log('upload');
    var file = e.target.files[0];
    var name = e.target.id;
    console.log(name);
    var storageRef = firebase.storage().ref('Storage/' + userID + '/' + name);
    var task = storageRef.put(file);
    var uploader = document.getElementById(e.target.id + "uploader");
    task.on('state_changed',
        function progress(snapshot) {
            uploader.value = snapshot.bytesTransferred * 100 / snapshot.totalBytes;
        },
        function error(err) {
            alert(err.message);
        },
        function complete() {}
    );
}

function useDefault(i) {
    var imageNames = ['SPA', 'A4C', 'A2C', 'PLA', 'PSA', 'SX4', 'TIS', 'NIC'];
    console.log(imageNames[i]);
    var storageRef = firebase.storage().ref('Storage/' + userID + '/');

    storageRef.child(imageNames[i] + '.gif').delete().then(function() {
        console.log('deleted' + imageNames[i]);
    }).catch(function(error) {
        console.log(error);
    });
}

function displayView() {
    var viewToDisplay = document.getElementById("chooseView").value;
    probeData.set({
        region: viewToDisplay
    });
}