var config = {
    apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
    authDomain: "breaking-vad-online-simulation.firebaseapp.com",
    databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
    storageBucket: "breaking-vad-online-simulation.appspot.com"
};
firebase.initializeApp(config);
var uid = localStorage.getItem('uid');
var values = firebase.database().ref(uid + "/values/");
var pValues = firebase.database().ref(uid + "/patientValues/");
var rpmValues = firebase.database().ref(uid + "/values/RPM");
var hemValues = firebase.database().ref(uid + "/patientValues/hematocrit");

function changeTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
}

function changePVCMTab(event, tabName) {
    // Declare all variables
    var i, PVCMcontent;

    // Get all elements with class="tabcontent" and hide them
    PVCMcontent = document.getElementsByClassName("PVCMcontent");
    for (i = 0; i < PVCMcontent.length; i++) {
        PVCMcontent[i].style.display = "none";
    }

   // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
}

function changeFPTab(idVis, idHide) {
    if (document.getElementById(idHide)) {
        document.getElementById(idHide).id = idVis;
        flowPowerCharts(idVis);
    }
}

function openHematocrit() {
    document.getElementById('hemaPopup').style.display='block';
}

function cancelHemaModal() {
    document.getElementById('hemaPopup').style.display = "none";
}

function keypadPush(number) {
    var hema = document.getElementById('hematocrit').value;
    if (hema.length<2) {
        document.getElementById('hematocrit').value = hema + String(number);
    }
}

function backspaceHema() {
    var hema = document.getElementById('hematocrit').value;
    if (hema.length) {
        document.getElementById('hematocrit').value = hema.substring(0,hema.length-1);
    }
}

function clearHema() {
    document.getElementById('hematocrit').value = '';
}

function okayHema() {
    cancelHemaModal();
    hemValues.set(document.getElementById('hematocrit').value);
    clearHema();
}

window.onload = function () {
    document.getElementById("defaultOpen").click();
    document.getElementById("flowChart").click();
    document.getElementById("defaultPVCM").click();

    flowPowerCharts('flowChartContainer');

    values.on('value', function(snapshot) {
        var output = snapshot.val();
        document.getElementById('rpmButton').innerHTML = output.RPM;
        document.getElementById('rpmValBold').innerHTML = output.RPM;
    });
    pValues.on('value', function(snapshot) {
        var output = snapshot.val();
        document.getElementById('hematocritBtn').innerHTML = String(output.hematocrit) + "%";
        document.getElementById('implantDateBtn').innerHTML = moment(output.implantDate).format("MM/DD/YY");
    })
};

var fpProps = [
    {axisX:{
        title : "Time (s)",
        titleFontColor: "blue",
        titleFontFamily: "arial",
        labelFontFamily: "arial",
        lineColor: "black",
        lineThickness: 5,
        tickColor: "black",
        labelFontColor: "black",
        // labelFontSize: 1
    },
        axisY:{
            title : "Flow (L/min)",
            titleFontColor: "blue",
            titleFontFamily: "arial",
            labelFontFamily: "arial",
            lineColor: "black",
            lineThickness: 5,
            minimum: 0,
            maximum: 10,
            tickColor: "black",
            gridColor: "white",
            labelFontColor: "black",
            labelFontSize: 10
    }},
    {axisX:{
            title : "Time (s)",
            titleFontColor: "red",
            titleFontFamily: "arial",
            labelFontFamily: "arial",
            lineColor: "black",
            lineThickness: 5,
            tickColor: "black",
            labelFontColor: "black",
            // labelFontSize: 0
        },
    axisY: {
        title : "Power (Watts)",
            titleFontColor: "red",
            titleFontFamily: "arial",
            labelFontFamily: "arial",
            lineColor: "black",
            lineThickness: 5,
            minimum: 0,
            maximum: 15,
            tickColor: "black",
            gridColor: "white",
            labelFontColor: "black",
            labelFontSize: 10
    }}];

function flowPowerCharts(idVis) {
    if (idVis == 'flowChartContainer') {var fp = 0;} else {fp = 1;}

    var data = []; // dataPoints
    var flowOrPower = 5;
    var amplitude = 1;
    var fpChart = new CanvasJS.Chart(idVis,{
        toolTip:{
            enabled: false
        },
        data: [{
            type: "line",
            dataPoints: data,
            color: "black"
        }],
        axisX: fpProps[fp].axisX,
        axisY: fpProps[fp].axisY
    });

    var tVal = 0;
    var updateInterval = 100;
    var dataLength = 200; // number of dataPoints visible at any point

    values.on('value', function(snapshot) {
        var output = snapshot.val();

        if (fp == 0) {
            flowOrPower = parseFloat(output.flowMinVal);
            amplitude = parseFloat(output.flowMaxVal - output.flowMinVal);
        } else {
            flowOrPower = parseFloat(output.power);
            amplitude = parseFloat(output['powerAmplitude']);
        }
        console.log(flowOrPower);
        console.log(amplitude);

    });

    var offsetVals = [[0, 0.05, 0.1, 0.35, 0.6, 0.85, 1, 1, 0.85, 0.6, 0.35, 0.1], [-0.2, -0.2, -0.1, 0, 0.2, 0.5, 0.6, 0.7, 0.5, 0.1, 0, -0.1]];
    var i = 0;
    var updateChart = function (count) {
        count = count || 1;
        // count is number of times loop runs to generate dataPoints.

        for (var j = 0; j < count; j++) {

            data.push({
                x: tVal,
                y: flowOrPower + amplitude*offsetVals[fp][i] + .15*Math.random()
            });
            tVal = tVal + .3;
            if (data.length > dataLength) {
                data.shift();
            }
        }

        fpChart.render();
        if(i<11) {
            i++;
        } else {
            i = 0;
        }
    };
    // generates first set of dataPoints
    updateChart(dataLength);

    // update chart after specified time.
    window.setInterval(function(){updateChart()}, updateInterval);
}

function openRPM() {
    document.getElementById('changeRpmModal').style.display='block';
}

function cancelModal() {
    document.getElementById('changeRpmModal').style.display = "none";
}

function increaseRPM() {
    var rpm = document.getElementById('rpmValBold').innerHTML;
    rpm = Number(rpm);
    rpm += 20;
    document.getElementById('rpmValBold').innerHTML = rpm;
}

function decreaseRPM() {
    var rpm = document.getElementById('rpmValBold').innerHTML;
    rpm = Number(rpm);
    rpm -= 20;
    document.getElementById('rpmValBold').innerHTML = rpm;
}

function changeRPM() {
    var rpm = document.getElementById('rpmValBold').innerHTML;
    rpmValues.set(rpm);
}