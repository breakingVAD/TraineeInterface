var config = {
    apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
    authDomain: "breaking-vad-online-simulation.firebaseapp.com",
    databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
    storageBucket: "breaking-vad-online-simulation.appspot.com",
};

firebase.initializeApp(config);

var userID = localStorage.getItem('userid');

var fileUploaders = document.getElementsByClassName("imageUpload");
for (var i=0; i<fileUploaders.length; i++) {
    fileUploaders[i].addEventListener('change', upload);
}

function upload(e) {
    var file = e.target.files[0];
    var names = ["PSA","SPA","A4C","A2C","PLA","SX4","Tissue","No Contact"];
    var name = names[e.target.id] + ".gif";
    var storageRef = firebase.storage().ref('Storage/' + name);
    var databaseRef = firebase.database().ref(userID + '/Images');
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
    databaseRef.push({
        name: file.name
    });
}
