window.onload = function () {

    var powerData = []; // dataPoints
    var flowData = []; // dataPoints

    var powerChart = new CanvasJS.Chart("powerChartContainer",{
        data: [{
            type: "line",
            dataPoints: powerData,
            color: "black"
        }],
        axisX:{
            title : "Time (s)",
            titleFontColor: "red",
            titleFontFamily: "arial",
            lineColor: "black",
            lineThickness: 5,
            tickColor: "black",
            labelFontColor: "black",
            labelFontSize: 20
        },
        axisY:{
            title : "Power (Watts)",
            titleFontColor: "red",
            titleFontFamily: "arial",
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
        data: [{
            type: "line",
            dataPoints: flowData
        }],
        axisX:{
            title : "Time (s)",
            titleFontColor: "blue",
            titleFontFamily: "arial",
            lineColor: "black",
            lineThickness: 5,
            tickColor: "black",
            labelFontColor: "black",
            labelFontSize: 20
        },
        axisY:{
            title : "Flow (L/min)",
            titleFontColor: "blue",
            titleFontFamily: "arial",
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
        document.getElementById("powerVal").innerHTML = output.power;
        document.getElementById("rpmVal").innerHTML = output.RPM;
        document.getElementById("flowRateVal").innerHTML = output.flowrate;

        var updateChart = function (count) {
            count = count || 1;
            // count is number of times loop runs to generate dataPoints.

            for (var j = 0; j < count; j++) {
                var flowRate = parseFloat(output.flowrate);
                var power = parseFloat(output.power);
                var powerAmp = parseFloat(output.powerAmplitude);
                var flowAmp = parseFloat(output.flowAmplitude);
                flowData.push({
                    x: tVal,
                    y: flowAmp*Math.sin(tVal) + flowRate
                });
                powerData.push({
                    x: tVal,
                    y: powerAmp*Math.sin(tVal) + power
                });
                tVal = tVal + .3;
            }
            if (powerData.length > dataLength) {
                powerData.shift();
            }
            if (flowData.length > dataLength) {
                flowData.shift();
            }
            flowChart.render();
            powerChart.render();
        };

        // generates first set of dataPoints
        updateChart(dataLength);

        // update chart after specified time.
        window.setInterval(function(){updateChart()}, updateInterval);
    });
};