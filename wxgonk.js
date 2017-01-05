function genTafUrl(stations) {
    // console.log("genTafUrl(" + stations + ") called.");
    var stationArray = stations.split(" ");
    var outputString = "https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=";
    for (var i = 0; i < stationArray.length; i++) {
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

function genMetarUrl(stations) {
    // console.log("genMetarUrl(" + stations + ") called.");
    var stationArray = stations.split(" ");
    var outputString = "https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=";
    for (var i = 0; i < stationArray.length; i++) {
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

function genFieldUrl(stations) {
    // console.log("genFieldUrl(" + stations + ") called.");
    var stationArray = stations.split(" ");
    var outputString = "https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=stations&requestType=retrieve&format=xml&stationString=";
    for (var i = 0; i < stationArray.length; i++) {
        if (i === 0) {
            outputString += stationArray[i];
        } else {
            outputString = outputString + "%20" + stationArray[i];
        }
    }
    console.log("genFieldUrl(" + stations + ") = " + outputString);
    console.log("replace w/regex = https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=stations&requestType=retrieve&format=xml&stationString=" + stations.replace)
    return outputString;
}

function addPrebuiltListeners() {
    // http://stackoverflow.com/questions/19655189/javascript-click-event-listener-on-class
    var prebuiltClass = document.getElementsByClassName("prebuilt");
    var writeToFooterCard = function () {
        var stationList = this.getAttribute("value");
        //window.open(genTafUrl(stationList));
        $.post("proxy.php", {
                url: genTafUrl(stationList)
            })
            .done(function (data) {
                displayRetData(data);
                buildTable(stationList);
                doJsonStuff(data);
            })
            .fail(function () {
                alert("fail!");
            });
        // alert("The base you clicked returns stationList = " + stationList);
    };
    Array.from(prebuiltClass).forEach(function (element) {
        element.addEventListener('click', writeToFooterCard);
    });
}

function displayRetData(info) {
    //document.getElementById("returnedData").innerHTML = "<pre>" + info.replace(/\,/g,"\n") + "</pre>";
    var obj = jQuery.parseJSON(info);
    document.getElementById("returnedData").innerHTML = "<pre>" + JSON.stringify(obj, null, 2) + "</pre>";
}

function buildTable(fieldNames, hours = 12) {
    var tableBuildString = "";
    var fieldArray = fieldNames.split(" ");
    var currTime = new Date();
    var currLocalHour = currTime.getHours();
    var currUtcHour = currTime.getUTCHours();
    /*
    console.log("currTime = " + currTime.toString());
    console.log("currTime.getHours() = " + currTime.getHours().toString());
    console.log("currTime.getUTCHours() = " + currTime.getUTCHours().toString());
    */
    for (var i = 0; i <= fieldArray.length; i++) {
        tableBuildString += "<tr";
        /*
        switch (i%3){
            case 0:
                tableBuildString += " class=\"bg-success\"";
                break;
            case 1:
                tableBuildString += " class=\"bg-warning\"";
                break;
            case 2:
                tableBuildString += " class=\"bg-danger\"";
                break;
        }
        */
        tableBuildString += ">";
        if (i === 0) {
            for (var j1 = 0; j1 <= hours; j1++) {
                if (j1 === 0) {
                    tableBuildString += "<th>UTC Offset: " + new Date().toString().match(/([\+-][0-9][0-9])/)[1] + "<br>UTC Day: " + currTime.getUTCDate() + "</th>";
                } else {
                    tableBuildString += "<th>" + (currLocalHour + j1 - 1) % 24 + "L/" + (currUtcHour + j1 - 1) % 24 + "Z</th>";
                    //currLocalHour ++; currUtcHour ++;
                    //currLocalHour %=24; currUtcHour %=24;
                }
            }
        } else {
            for (var j2 = 0; j2 <= hours; j2++) {
                if (j2 === 0) {
                    tableBuildString += "<td id=\"" + fieldArray[i-1] + "\" title=\"" + fieldArray[i-1] + "\">" + fieldArray[i - 1] + "</td>";
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
function doJsonStuff(jsonIn){
    var obj = jQuery.parseJSON(jsonIn);
    console.dir(obj);
}