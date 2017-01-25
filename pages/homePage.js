window.onload = function () {

    var powerData = []; // dataPoints
    var flowData = []; // dataPoints
    var flowRate;
    var power;
    var powerAmp;
    var flowAmp;
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
            labelFontSize: 20
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
            labelFontSize: 20
        }
    });

    var tVal = 0;
    var updateInterval = 100;
    var dataLength = 200; // number of dataPoints visible at any point

    var config = {
        apiKey: "AIzaSyCgUH5OSIKVmCNPJHkSQhCHgl66iM-7f_g",
        authDomain: "project-b10ed.firebaseapp.com",
        databaseURL: "https://project-b10ed.firebaseio.com",
        storageBucket: "project-b10ed.appspot.com"
    };
    firebase.initializeApp(config);
    var values = firebase.database().ref("values/");


    values.on('value', function(snapshot) {
        var output = snapshot.val();

        $('#tempOutput').html("<b>Flow Rate: </b>"+output.flowrate + "<br/> <b>RPM:</b> " + output.RPM + "<br/> <b>Power:</b> " + output.power);

        flowRate = parseFloat(output.flowrate);
        power = parseFloat(output.power);
        powerAmp = parseFloat(output.powerAmplitude);
        flowAmp = parseFloat(output.flowAmplitude);
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
    });
};
