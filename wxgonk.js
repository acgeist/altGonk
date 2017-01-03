//http://www.albionresearch.com/misc/urlencode.php
function reqXmlFromProxy(recUrl) {
    document.getElementById("p3").innerHTML = "localhost/altGonk/proxy.php?url=" + encodeURIComponent(recUrl);

    var xhr = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            document.getElementById("xml").innerHTML = xhr.responseText;
        }
    };

    var usedUrl = "proxy.php?url=" + encodeURIComponent(recUrl);
    xhr.open("GET", usedUrl, true);
    xhr.send(null);
}
function genTafUrl(stations){
    // console.log("genTafUrl(" + stations + ") called.");
    var stationArray = stations.split(" ");
    var outputString = "https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=";
    for (var i = 0; i<stationArray.length; i++){
        if (i === 0) {
            outputString += stationArray[i];
        } else {
            outputString = outputString + "%20" + stationArray[i];
        }
    }
    outputString += "&hoursBeforeNow=24&mostRecentForEachStation=true";
    // console.log("genTafUrl(" + stations + ") = " + outputString);
    return outputString;
}
function genMetarUrl(stations){
    // console.log("genMetarUrl(" + stations + ") called.");
    var stationArray = stations.split(" ");
    var outputString = "https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=";
    for (var i = 0; i<stationArray.length; i++){
        if (i === 0) {
            outputString += stationArray[i];
        } else {
            outputString = outputString + "%20" + stationArray[i];
        }
    }
    outputString += "&hoursBeforeNow=3&mostRecentForEachStation=true";
    // console.log("genMetarUrl(" + stations + ") = " + outputString);
    return outputString;
}
function genFieldUrl(stations){
    // console.log("genFieldUrl(" + stations + ") called.");
    var stationArray = stations.split(" ");
    var outputString = "https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=stations&requestType=retrieve&format=xml&stationString=";
    for (var i = 0; i<stationArray.length; i++){
        if (i === 0) {
            outputString += stationArray[i];
        } else {
            outputString = outputString + "%20" + stationArray[i];
        }
    }
    // console.log("genFieldUrl(" + stations + ") = " + outputString);
    return outputString;
}

