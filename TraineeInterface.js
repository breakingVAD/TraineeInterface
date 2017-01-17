window.onload = function () {
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