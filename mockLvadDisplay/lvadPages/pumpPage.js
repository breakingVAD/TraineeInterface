var config = {
    apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
    authDomain: "breaking-vad-online-simulation.firebaseapp.com",
    databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
    storageBucket: "breaking-vad-online-simulation.appspot.com"
};
firebase.initializeApp(config);
var uid = localStorage.getItem('uid');
var values = firebase.database().ref(uid + "/values/");
var rpmValues = firebase.database().ref(uid + "/values/RPM");



function changeTab(id) {
    if (id) {
        document.getElementById(id).style.visibility = "visible";
    } else {
        document.getElementById('speedControl').style.visibility = "hidden";
    }
}

function changeFPTab(idVis, idHide) {
    if (document.getElementById(idHide)) {
        console.log('if statement');
        document.getElementById(idHide).id = idVis;
        flowPowerCharts(idVis);
    }
}

window.onload = function () {
    document.getElementById("defaultOpen").click();
    document.getElementById("flowChart").click();

    flowPowerCharts('flowChartContainer');

    values.on('value', function(snapshot) {
        var output = snapshot.val();
        document.getElementById('rpmButton').innerHTML = output.RPM;
        document.getElementById('rpmValBold').innerHTML = output.RPM;
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

        var fpStrings = ['flowrate','power'];
        flowOrPower = parseFloat(output[fpStrings[fp]]);
        fpStrings = ['flowAmplitude','powerAmplitude'];
        amplitude = parseFloat(output[fpStrings[fp]]);

    });

    var offsetVals = [[-0.9, -0.8, -0.7, -0.2, 0.3, 0.8, 1.2, 1.2, 0.8, 0.3, -0.2, -0.7],[-0.2, -0.2, -0.1, 0, 0.2, 0.5, 0.6, 0.7, 0.5, 0.1, 0, -0.1]];
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