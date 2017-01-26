window.onload = function () {
    var config = {
        apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
        authDomain: "breaking-vad-online-simulation.firebaseapp.com",
        databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
        storageBucket: "breaking-vad-online-simulation.appspot.com",
        messagingSenderId: "973903229310"
    };
    firebase.initializeApp(config);
    var values = firebase.database().ref("values/");

    values.on('value', function(snapshot) {
        var output = snapshot.val();

        $('#tempOutput').html("<b>Flow Rate: </b>"+output.flowrate + "<br/> <b>RPM:</b> " + output.RPM + "<br/> <b>Power:</b> " + output.power);
        document.getElementById("powerVal").innerHTML = output.power;
        document.getElementById("rpmVal").innerHTML = output.RPM;
        document.getElementById("flowRateVal").innerHTML = output.flowrate;

    });
};

function Page(src, iconId, whiteIconImg, iconImg, displayed) {
    this.src = src;
    this.iconId = iconId;
    this.iconImg = iconImg;
    this.whiteIconImg = whiteIconImg;
    this.displayed = displayed; 
}

var pages = [new Page("pages/homePage.html", "homeIcon", "images/homeIconWhite.png", "images/homeIcon.png", true),
    new Page("pages/alarmPage.html", "alarmIcon", "images/alarmIconWhite.png", "images/alarmIcon.png", false),
    new Page("pages/graphPage.html", "graphIcon", "images/graphIconWhite.png", "images/graphIcon.png", false),
    new Page("pages/pumpPage.html", "pumpIcon", "images/pumpIconWhite.png", "images/pumpIcon.png", false),
    new Page("pages/powerPage.html", "powerIcon", "images/powerIconWhite.png", "images/powerIcon.png", false)];

function changePage(icon, pageNum) {
    if (!pages[pageNum].displayed) {    //icon.src.substring(len-8, len) == "Icon.png") {
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