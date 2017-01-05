"use strict";
function genTafUrl(stations) {
    console.log("genTafUrl(" + stations + ") called.");
    return "https://www.aviationweather.gov/adds/dataserver_current" +
        "/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=" +
        stations.replace(/\s/g, "%20") + "&hoursBeforeNow=24&mostRecentForEachStation=true";
}

function genMetarUrl(stations) {
    // console.log("genMetarUrl(" + stations + ") called.");
    return "https://www.aviationweather.gov/adds/dataserver_current" +
        "/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=" +
        stations.replace(/\s/g, "%20") + "&hoursBeforeNow=3&mostRecentForEachStation=true";
}

function genFieldUrl(stations) {
    // console.log("genFieldUrl(" + stations + ") called.");
    return "https://www.aviationweather.gov/adds/dataserver_current" +
        "/httpparam?dataSource=stations&requestType=retrieve&format=xml&stationString=" +
        stations.replace(/\s/g, "%20");
}
function displayRetData(info) {
    document.getElementById("returnedData").innerHTML += "<pre>" +
        JSON.stringify(jQuery.parseJSON(info), null, 2) + "</pre><hr/>";
}
function buildTable(fieldNames, hours = 12) {
    var tableBuildString = "";
    var fieldArray = fieldNames.split(" ");
    var currTime = new Date();
    var currLocalHour = currTime.getHours();
    var currUtcHour = currTime.getUTCHours();
    for (var i = 0; i <= fieldArray.length; i++) {
        tableBuildString += "<tr>";
        if (i === 0) {
            for (var j1 = 0; j1 <= hours; j1++) {
                if (j1 === 0) {
                    tableBuildString += "<th>UTC Offset: " +
                        new Date().toString().match(/([\+-][0-9][0-9])/)[1] +
                        "<br>UTC Day: " + currTime.getUTCDate() + "</th>";
                } else {
                    tableBuildString += "<th>" + (currLocalHour + j1 - 1) % 24 +
                        "L/" + (currUtcHour + j1 - 1) % 24 + "Z</th>";
                    //currLocalHour ++; currUtcHour ++;
                    //currLocalHour %=24; currUtcHour %=24;
                }
            }
        } else {
            for (var j2 = 0; j2 <= hours; j2++) {
                if (j2 === 0) {
                    tableBuildString += "<td id=\"" + fieldArray[i - 1] +
                        "\" title=\"" + fieldArray[i - 1] + "\">" + fieldArray[i - 1] + "</td>";
                } else {
                    tableBuildString += "<td>i=" + i + ",j=" + j2 + "</td>";
                }
            }
        }
        tableBuildString += "</tr>";
    }
    document.getElementById("masterTable").removeAttribute("hidden");
    document.getElementById("masterTable").innerHTML = tableBuildString;
}
function addListeners() {
    // http://stackoverflow.com/questions/19655189/javascript-click-event-listener-on-class
    var prebuiltClass = document.getElementsByClassName("prebuilt");
    var fetchXml = function () {
        var stationList = this.getAttribute("value");
        buildTable(stationList);
        $.post("proxy.php", {
                url: genFieldUrl(stationList)
            })
            .done(function (data) {
                displayRetData(data);
            })
            .fail(function () {
                window.alert("fail!");
            });
        $.post("proxy.php", {
                url: genMetarUrl(stationList)
            })
            .done(function (data) {
                displayRetData(data);
            })
            .fail(function () {
                window.alert("fail!");
            });
        $.post("proxy.php", {
                url: genTafUrl(stationList)
            })
            .done(function (data) {
                displayRetData(data);
            })
            .fail(function () {
                window.alert("fail!");
            });
    };
    Array.from(prebuiltClass).forEach(function (element) {
        element.addEventListener("click", fetchXml);
    });
}