var flowRate; var power; var powerAmp; var flowMin; var flowMax; var flowAmp; var smoothingFunc;

var config = {
    apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
    authDomain: "breaking-vad-online-simulation.firebaseapp.com",
    databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
    storageBucket: "breaking-vad-online-simulation.appspot.com"
};
firebase.initializeApp(config);
var uid = localStorage.getItem('uid');
var values = firebase.database().ref(uid + "/values/");


window.onload = function () {

    var powerData = []; // dataPoints
    var flowData = []; // dataPoints

    flowRate = parseFloat(1);
    power = parseFloat(1);
    powerAmp = parseFloat(1);
    flowMin = parseFloat(1);
    flowMax = parseFloat(1);
    flowAmp = parseFloat(1);

    var powerChart = new CanvasJS.Chart("powerChartContainer",{
        toolTip:{
            enabled: false
        },
        data: [{
            type: "line",
            dataPoints: powerData,
            color: "black"
        }],
        axisX:{
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
        axisY:{
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
        }
    });

    var flowChart = new CanvasJS.Chart("flowChartContainer",{
        toolTip:{
            enabled: false
        },
        data: [{
            type: "line",
            dataPoints: flowData
        }],
        axisX:{
            title : "Time (s)",
            titleFontColor: "blue",
            titleFontFamily: "arial",
            labelFontFamily: "arial",
            lineColor: "black",
            lineThickness: 5,
            tickColor: "black",
            labelFontColor: "black"
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
        }
    });

    flowChart.render();
    powerChart.render();

    var tVal = 0;
    var updateInterval = 100;
    var dataLength = 200; // number of dataPoints visible at any point

    var powerVals = [-0.2, -0.2, -0.1, 0, 0.2, 0.5, 0.6, 0.7, 0.5, 0.1, 0, -0.1];
    var flowVals = [0, 0.05, 0.1, 0.35, 0.6, 0.85, 1, 1, 0.85, 0.6, 0.35, 0.1];
    var i = 0;

    var updateChart = function (count) {
        count = count || 1;
        // count is number of times loop runs to generate dataPoints.

        for (var j = 0; j < count; j++) {

            flowData.push({
                x: tVal,
                y: flowMin + flowAmp*flowVals[i] + .15*Math.random()
            });
            powerData.push({
                x: tVal,
                y: power + powerAmp*powerVals[i] + .2*Math.random()
            });
            tVal = tVal + .3;
            if (powerData.length > dataLength) {
                powerData.shift();
            }
            if (flowData.length > dataLength) {
                flowData.shift();
            }
        }

        flowChart.render();
        powerChart.render();
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
};

values.on('value', function(snapshot) {
    var output = snapshot.val();

    var powerDiff = parseFloat(output.power) - power;
    var powerAmpDiff = parseFloat(output.powerAmplitude) - powerAmp;
    var flowMinDiff = parseFloat(output.flowMinVal) - flowMin;
    var newFlowAmp = parseFloat(output.flowMaxVal - output.flowMinVal);
    var flowAmpDiff = newFlowAmp - flowAmp;

    smoothingFunc = window.setInterval(function() {
        incrementPF(powerDiff, output.power, powerAmpDiff, output.powerAmplitude, flowMinDiff, output.flowMinVal, flowAmpDiff, newFlowAmp);
    }, 200);
});


function incrementPF(powerDiff, setPower, powerAmpDiff, setPowerAmp, flowMinDiff, setFlowMin, flowAmpDiff, setFlowAmp) {
    power += powerDiff / 30;
    flowMin += flowMinDiff / 30;
    powerAmp += powerAmpDiff / 30;
    flowAmp += flowAmpDiff / 30;
    
    if ((powerDiff > 0 && power >= setPower) || (powerDiff < 0 && power <= setPower) || (powerAmpDiff > 0 && powerAmp >= setPowerAmp) || (powerAmpDiff < 0 && powerAmp <= setPowerAmp) || (flowMinDiff > 0 && flowMin >= setFlowMin) || (flowMinDiff < 0 && flowMin <= setFlowMin) || (flowAmpDiff > 0 && flowAmp >= setFlowAmp) || (flowAmpDiff < 0 && flowAmp <= setFlowAmp)) {
        power = parseFloat(setPower);
        flowMin = parseFloat(setFlowMin);
        powerAmp = parseFloat(setPowerAmp);
        flowAmp = parseFloat(setFlowAmp);
        clearTimeout(smoothingFunc);
    }
}
