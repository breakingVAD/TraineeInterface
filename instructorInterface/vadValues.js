var config = {
    apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
    authDomain: "breaking-vad-online-simulation.firebaseapp.com",
    databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
    storageBucket: "breaking-vad-online-simulation.appspot.com",
};

firebase.initializeApp(config);
var userID = localStorage.getItem('userid');

var values = firebase.database().ref(userID + "/" +"values");
var savedValues = firebase.database().ref(userID + "/Saved Values");

savedValues.on('value',function(snapshot){
    var tables = document.getElementsByClassName("savedSims");
    for (var i=0; i<tables.length; i++) {
        table = tables[i];
        while(table.rows.length>0) {
            table.deleteRow(0);
        }
    }

    var output = snapshot.val();

    var table; var row; var entry; var btn; var deleteButton; var node;
    var tableInd = 0;
    table = tables[0];
    for(var key in output){
        if (table.rows.length>4) {
            table = tables[++tableInd];
        }
        entry = output[key];
        row = table.insertRow();
        btn = document.createElement("BUTTON");
        btn.innerHTML = key;
        btn.style = "width:100%";

        row.insertCell(0).appendChild(btn);

        btn.setAttribute("id",key);
        $("#" + key).click(function(){
            var name = firebase.database().ref(userID + "/Saved Values/" + key);
            name.once('value', function(snapshot) {
                var output = snapshot.val();
                values.set(
                    {
                        flowrate: output.flowrate,
                        RPM: output.RPM,
                        power: output.power,
                        powerAmplitude: output.powerAmplitude,
                        flowAmplitude: output.flowAmplitude
                    }
                );

            });

        });

        deleteButton = document.createElement("BUTTON");
        deleteButton.innerHTML = "X";
        deleteButton.style = "background-color: red";
        deleteButton.style.color = "white";
        row.insertCell(1).appendChild(deleteButton);

        deleteButton.setAttribute("id","id"+key);
        deleteButton.setAttribute("onclick", "deleteFunc(event)");


    }
});

function deleteFunc(event){
    var id = event.srcElement.id;
    var key = id.substring(2,id.length);
    var saved = firebase.database().ref(userID + "/Saved Values/" + key);
    saved.remove();
}

console.log(userID);


function buttonAction(){
    var valueIds = ['flowrate', 'RPM', 'power','powerAmplitude','flowAmplitude'];
    var setValues = {};
    for (var i=0; i<valueIds.length; i++) {
        var val = $('#' + valueIds[i]).val();
        if (val) {
            setValues[valueIds[i]] = val;
            document.getElementById(valueIds[i]).value = '';

        } else {
            setValues[valueIds[i]] = document.getElementById(valueIds[i] + 'CDV').innerHTML;
        }
    }
    values.set(setValues);
}

values.on('value', function(snapshot) {
    var output = snapshot.val();
    var valueIds = ['flowrate', 'RPM', 'power','powerAmplitude','flowAmplitude'];
    for (var i=0; i<valueIds.length; i++) {
        document.getElementById(valueIds[i] + "CDV").innerHTML = output[valueIds[i]];
    }
});

function buttonAction2(){
    var presetName = $('#name').val();
    if (presetName) {
        var values = firebase.database().ref(userID + "/Saved Values/" + presetName);

        var setValues = {name: presetName};

        var valueIds = ['flowrate', 'RPM', 'power','powerAmplitude','flowAmplitude'];
        for (var i=0; i<valueIds.length; i++) {
            setValues[valueIds[i]] = document.getElementById(valueIds[i] + "CDV").innerHTML;
        }
        values.set(setValues);
        document.getElementById('name').value = "";
    }
}

