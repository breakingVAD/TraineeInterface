window.onload = function () {

    var powerData = []; // dataPoints
    var flowData = []; // dataPoints
    // for (var j=0; j<60; j++) {
    //     powerData.push({
    //         x: j,
    //         y: 5
    //     });
    //     flowData.push({
    //         x: j,
    //         y: 5
    //     });
    //     }
    console.log(flowData);
    console.log(powerData);

    var flowRate = 5;
    var power = 5;
    var powerAmp = 1;
    var flowAmp = 1;

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
    console.log('start render');
    flowChart.render();
    powerChart.render();
    console.log('stop render');
    console.log(flowData);
    console.log(powerData);
    var tVal = 0;
    var updateInterval = 100;
    var dataLength = 200; // number of dataPoints visible at any point

    var config = {
        apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
        authDomain: "breaking-vad-online-simulation.firebaseapp.com",
        databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
        storageBucket: "breaking-vad-online-simulation.appspot.com"
    };
    firebase.initializeApp(config);
    var uid = localStorage.getItem('uid');
    var values = firebase.database().ref(uid + "/values/");

    var gotValues = false;
    values.on('value', function(snapshot) {
        var output = snapshot.val();

        $('#tempOutput').html("<b>Flow Rate: </b>"+output.flowrate + "<br/> <b>RPM:</b> " + output.RPM + "<br/> <b>Power:</b> " + output.power);

        flowRate = parseFloat(output.flowrate);
        power = parseFloat(output.power);
        powerAmp = parseFloat(output.powerAmplitude);
        flowAmp = parseFloat(output.flowAmplitude);
        console.log('got values');
        gotValues = true;
    });

    var powerVals = [-0.2, -0.2, -0.1, 0, 0.2, 0.5, 0.6, 0.7, 0.5, 0.1, 0, -0.1];
    var flowVals = [-0.9, -0.8, -0.7, -0.2, 0.3, 0.8, 1.2, 1.2, 0.8, 0.3, -0.2, -0.7];
    var i = 0;

    var updateChart = function (count) {
        count = count || 1;
        // count is number of times loop runs to generate dataPoints.

        for (var j = 0; j < count; j++) {

            flowData.push({
                x: tVal,
                y: flowRate + flowAmp*flowVals[i] + .15*Math.random()
            });
            powerData.push({
                x: tVal,
                y: power + flowAmp*powerVals[i] + .2*Math.random()
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
