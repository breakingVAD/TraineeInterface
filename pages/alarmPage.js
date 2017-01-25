window.onload = function () {
    document.getElementById("defaultOpen").click();
};

function changeTab(idVis, idHide) {
    document.getElementById(idVis).style.visibility = "visible";
    document.getElementById(idHide).style.visibility = "hidden";
}
