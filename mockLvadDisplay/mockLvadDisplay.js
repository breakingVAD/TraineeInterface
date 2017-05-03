var power;
var RPM;
var flow;
var smoothingFunc;

window.onload = function () {
    startTime();
    if (!localStorage.getItem('trainee')) {
        document.getElementById('buttonsTable').style.visibility = 'hidden';
    }
    var config = {
        apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
        authDomain: "breaking-vad-online-simulation.firebaseapp.com",
        databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
        storageBucket: "breaking-vad-online-simulation.appspot.com",
        messagingSenderId: "973903229310"
    };
    firebase.initializeApp(config);
    var uid = localStorage.getItem('uid');
    var values = firebase.database().ref(uid + "/values/");

    values.on('value', function(snapshot) {
        var output = snapshot.val();

        $('#tempOutput').html("<b>Flow Rate: </b>"+output.flowrate + "<br/> <b>RPM:</b> " + output.RPM + "<br/> <b>Power:</b> " + output.power);
        var oldPower = Number(document.getElementById("powerVal").innerHTML);
        var powerDiff = output.power - oldPower;
        var oldRPM = Number(document.getElementById("rpmVal").innerHTML);
        var RPMDiff = output.RPM - oldRPM;
        var oldFlow = Number(document.getElementById("flowRateVal").innerHTML);
        var flowDiff = output.flowrate - oldFlow;

        power = oldPower;
        RPM = oldRPM;
        flow = oldFlow;
        smoothingFunc = window.setInterval(function() {
            incrementPRF(powerDiff, output.power, RPMDiff, output.RPM, flowDiff, output.flowrate);
        }, 200);
    });
};


function incrementPRF(powerDiff, setPower, RPMDiff, setRPM, flowDiff, setFlow) {
    power += powerDiff / 30;
    RPM += RPMDiff / 30;
    flow += flowDiff / 30;

    document.getElementById("powerVal").innerHTML = power.toFixed(1);
    document.getElementById("rpmVal").innerHTML = Math.ceil(RPM);
    document.getElementById("flowRateVal").innerHTML = flow.toFixed(1);
    if ((powerDiff > 0 && power >= setPower) || (powerDiff <= 0 && power <= setPower)) {
        document.getElementById("powerVal").innerHTML = Number(setPower).toFixed(1);
        document.getElementById("rpmVal").innerHTML = Math.ceil(setRPM);
        document.getElementById("flowRateVal").innerHTML = Number(setFlow).toFixed(1);
        clearTimeout(smoothingFunc);
    }
}

// Get the modal
var pwModal = document.getElementById('passwordPopup');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == pwModal) {
        pwModal.style.display = "none";
    }
};

function Page(src, iconId, whiteIconImg, iconImg, displayed) {
    this.src = src;
    this.iconId = iconId;
    this.iconImg = iconImg;
    this.whiteIconImg = whiteIconImg;
    this.displayed = displayed; 
}

var pages = [new Page("lvadPages/homePage.html", "homeIcon", "../images/homeIconWhite.png", "../images/homeIcon.png", true),
    new Page("lvadPages/alarmPage.html", "alarmIcon", "../images/alarmIconWhite.png", "../images/alarmIcon.png", false),
    new Page("lvadPages/graphPage.html", "graphIcon", "../images/graphIconWhite.png", "../images/graphIcon.png", false),
    new Page("lvadPages/pumpPage.html", "pumpIcon", "../images/pumpIconWhite.png", "../images/pumpIcon.png", false)];

function changePage(icon, pageNum) {
    if (!pages[pageNum].displayed) {    //icon.src.substring(len-8, len) == "Icon.png") {
        if (pageNum==3) {
            document.getElementById('passwordPopup').style.display='block';
        } else {
            icon.src = pages[pageNum].whiteIconImg;
            document.getElementById("pageFrame").src = pages[pageNum].src;
            pages[pageNum].displayed = true;
            pages.forEach(function(page) {
                if (page !== pages[pageNum]) {
                    document.getElementById(page.iconId).src = page.iconImg;
                    page.displayed = false;
                }
            })
        }
    }     
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML =
        h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i}  // add zero in front of numbers < 10
    return i;
}

function keypadPush(number) {
    var pw = document.getElementById('password').value;
    if (pw.length<6) {
        document.getElementById('password').value = pw + String(number);
    }
}

function backspacePW() {
    var pw = document.getElementById('password').value;
    if (pw.length) {
        document.getElementById('password').value = pw.substring(0,pw.length-1);
    }
}

function clearPW() {
    document.getElementById('password').value = '';
}

function cancelModal() {
    document.getElementById('passwordPopup').style.display = "none";
    clearPW();
}

function cancelPowerModal() {
    document.getElementById('powerPopup').style.display = "none";
}

function okayPW() {
    var pw = document.getElementById('password').value;
    if (pw === '123456') {
        document.getElementById('passwordPopup').style.display = "none"; //close pw popup
        document.getElementById('pumpIcon').src = pages[3].whiteIconImg;
        document.getElementById("pageFrame").src = pages[3].src; //switch to pump page
        pages[3].displayed = true;
        pages.forEach(function(page) {
            if (page !== pages[3]) {
                document.getElementById(page.iconId).src = page.iconImg;
                page.displayed = false;
            }
        });
        clearPW();
    }
}

function logOut() {
    localStorage.removeItem('uid');
    window.top.location = '../index.html';
}

function goToEchoSim() {
    window.top.location = 'lvadPages/echoSimulation.html';
}

function powerOff() {
    document.getElementById('powerPopup').style.display='block';
}