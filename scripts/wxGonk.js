"use strict";
/*
TODO: 
-Constants should be on the page so the user can edit.
-Embed zulu clock from USNO
-Countdown/auto-refresh
-Show raw METARs/TAFs below table
-Add a legend showing what each color means.
-Allow user to hand-jam timezone/UTC offset
-Embed a picture of the filing tree?
-Ensure a cell can't get upgraded.
*/
const TEST_CASE_STATIONS = "KGEG KVAD KHLN KBLU KTRK KSXT CYVO CYSB";
const FILING_MINS = {
  "vis": 1.5,
  "ceiling": 500
};
const ALT_REQ = {
  "vis": 3,
  "ceiling": 2000
};
const ALT_MINS = {
  "vis": 2,
  "ceiling": 1000
};
const NO_CEIL_VAL = 99900;
const STOPLIGHT_GREEN_CLASS = "bg-success";
const STOPLIGHT_YELLOW_CLASS = "bg-warning";
const STOPLIGHT_RED_CLASS = "bg-danger";
const HOME_STATION_CLASS = "bg-primary";
const ALT_CLASS = "bg-info";
const METAR_STALE_TIME = 1000 * 60 * 90;

function makeUrl(dataSource, stationList) {
  var ending;
  switch (dataSource.toUpperCase()) {
  case "TAFS":
    ending = "tafs&hoursBeforeNow=24&mostRecentForEachStation=true&stationString=";
    break;
  case "METARS":
    ending = "metars&hoursBeforeNow=3&mostRecentForEachStation=true&stationString=";
    break;
  case "FIELDS":
    ending = "stations&stationString=";
    break;
  default:
    console.log("Error: wxgonk.js/makeUrl(" + dataSource + ", " + stationList + ") could not generate a valid URL.");
    break;
  }
  return ["https://www.aviationweather.gov", "/adds", "/dataserver_current", "/httpparam?", "requestType=retrieve",
        "&format=xml", "&dataSource=", ending, stationList.replace(/\s/g, "%20")].join("");
}

function hasCeil(skyCondNode) {
  if (Array.isArray(skyCondNode)) {
    return skyCondNode.filter(function (layer) {
        return layer["@attributes"].sky_cover === "BKN" || layer["@attributes"].sky_cover === "OVC" || layer[
          "@attributes"].sky_cover === "OVX";
      })
      .length > 0;
  } else {
    return skyCondNode["@attributes"]["sky_cover"] === "BKN" || skyCondNode["@attributes"]["sky_cover"] === "OVC" ||
      skyCondNode["@attributes"]["sky_cover"] === "OVX";
  }
}

function getCeilFromSkyCond(skyCondNode) {
  if (!hasCeil(skyCondNode)) {
    return NO_CEIL_VAL;
  } else if (Array.isArray(skyCondNode)) {
    return skyCondNode.filter(layer => {
        return layer["@attributes"].sky_cover === "BKN" || layer["@attributes"].sky_cover === "OVC" || layer[
          "@attributes"].sky_cover === "OVX";
      })
      .reduce((lowest, layer) => {
        return Number(layer["@attributes"].cloud_base_ft_agl < lowest ? layer["@attributes"].cloud_base_ft_agl :
          lowest);
      }, NO_CEIL_VAL);
  } else {
    return skyCondNode["@attributes"].cloud_base_ft_agl;
  }
}

function canFileMetar(metarJson, useCirclAppch = false) {
  return useCirclAppch ? metarJson.visibility_statute_mi >= FILING_MINS.vis && getCeilFromSkyCond(metarJson.sky_condition) >=
    FILING_MINS.ceiling : metarJson.visibility_statute_mi >= FILING_MINS.vis;
}

function altReqdMetar(metarJson) {
  return metarJson.visibility_statute_mi < ALT_REQ.vis || getCeilFromSkyCond(metarJson.sky_condition) < ALT_REQ.ceiling;
}

function isValidAltMetar(metarJson) {
  return metarJson.visibility_statute_mi >= ALT_MINS.vis && getCeilFromSkyCond(metarJson.sky_condition) >= ALT_MINS.ceiling;
}

function isValidAltButTempoBelowMins(tafJson) {}

function getStoplightClassFromMetar(metarJson, isHomeStation = false) {
  if (isHomeStation && !canFileMetar(metarJson)) {
    return STOPLIGHT_RED_CLASS;
  } else if (isHomeStation && altReqdMetar(metarJson)) {
    return STOPLIGHT_YELLOW_CLASS;
  } else if (isHomeStation) {
    return STOPLIGHT_GREEN_CLASS;
  } else if (!isValidAltMetar(metarJson)) {
    return STOPLIGHT_RED_CLASS;
  } else {
    return STOPLIGHT_GREEN_CLASS;
  }
}

function convertTextTime(textTime) {
  var year = textTime.replace(/^"?(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z"?$/i, "$1"),
    //Subtract one from the month since Javascript uses zero-subscripting (e.g. February = 1).
    month = textTime.replace(/^"?(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z"?$/i, "$2") - 1,
    date = textTime.replace(/^"?(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z"?$/i, "$3"),
    hours = textTime.replace(/^"?(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z"?$/i, "$4"),
    minutes = textTime.replace(/^"?(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z"?$/i, "$5");
  return new Date(Date.UTC(year, month, date, hours, minutes));
}

function qcStoplight(newClass, currClass) {
  if (currClass === null) {
    return newClass;
  } else if (currClass === STOPLIGHT_RED_CLASS || newClass === STOPLIGHT_RED_CLASS) {
    return STOPLIGHT_RED_CLASS;
  } else if (currClass === STOPLIGHT_YELLOW_CLASS || newClass === STOPLIGHT_YELLOW_CLASS) {
    return STOPLIGHT_YELLOW_CLASS;
  } else {
    return newClass;
  }
}
var processFieldData = fieldJson => {
  var sites = JSON.parse(fieldJson)["data"]["Station"].map(field => {
    return {
      "ICAO": field.station_id,
      "name": field.site
    }
  });
  sites.forEach(function (field) {
    /*
    For some Korean airfields, the closing paren is missing for no apparent reason.  This causes
    the name to display as, for example, "PYONGTAEK (A-511" vice the correct "PYONGTAEK (A-511)".
    Specific examples (cao 20170226): RKSO, RKTU, RKTN, RKSG, RKNN, RKJJ, RKTI, RKJK, RKTH, RKSM, RKSW
    */
    field.name = /\(/.test(field.name) && !/\)/.test(field.name) ? field.name + ")" : field.name;
    var fieldIdCell = document.querySelector("#" + field.ICAO);
    fieldIdCell.setAttribute("title", fieldIdCell.getAttribute("title")
      .replace(/NAME:/i, "NAME:\n" + field.name));
  })
}
var processMetarData = function (metarJson) {
  //printRawJson(metarJson);
  JSON.parse(metarJson)
    .data.METAR.filter(field => {
      // Only show/process METARs that have been published within the past [METAR_STALE_TIME] milliseconds.
      return new Date()
        .valueOf() - convertTextTime(field.observation_time)
        .valueOf() < METAR_STALE_TIME;
    })
    .forEach(function (field) {
      var fieldIdCell = document.getElementById(field.station_id);
      fieldIdCell.setAttribute("title", fieldIdCell.getAttribute("title")
        .replace(/METAR:/i, "METAR:\n" + field.raw_text));
      var cell = document.createElement("td");
      cell.setAttribute("class", qcStoplight(getStoplightClassFromMetar(field, fieldIdCell.parentElement.rowIndex ===
        1), cell.getAttribute("class")));
      cell.innerHTML = ("00" + (getCeilFromSkyCond(field.sky_condition) / 100))
        .slice(-3) + "/" + field.visibility_statute_mi + "SM";
      fieldIdCell.parentNode.appendChild(cell);
      fieldIdCell.nextSibling.setAttribute("title", field.raw_text);
    });
}
var processTafData = function (tafJson) {
  //printRawJson(tafJson);
  JSON.parse(tafJson)["data"]["TAF"].forEach(function (field) {
    var fieldIdCell = document.querySelector("#" + field.station_id);
    fieldIdCell.setAttribute("title", fieldIdCell.getAttribute("title")
      .replace(/TAF:/i, "TAF:\n" + field.raw_text.replace(/(TEMPO|FM|BECMG)/gi, "\n$1")));
  })
}

function printRawJson(jsonString) {
  document.body.removeChild(document.body.lastChild);
  var rawJson = document.createElement("pre");
  rawJson.innerHTML = JSON.stringify($.parseJSON(jsonString), null, 2);
  document.body.appendChild(rawJson);
}

function buildTable(fieldNames, hours = 12) {
  var i,
    tableBuildString = "",
    fieldArray = fieldNames.split(" "),
    currTime = new Date(),
    currLocalHour = currTime.getHours(),
    currUtcHour = currTime.getUTCHours();
  tableBuildString += "<tr><th>UTC Offset: " + currTime.toString()
    .match(/([\+-][0-9][0-9])/)[1] + "<br>UTC Day: " + currTime.getUTCDate() + "</th>";
  for (i = 0; i < hours; i++) {
    tableBuildString += "<th>" + (currLocalHour + i) % 24 + "L/" + (currUtcHour + i) % 24 + "Z</th>";
  }
  tableBuildString += "</tr>";
  for (i = 0; i < fieldArray.length; i++) {
    tableBuildString += "<tr><td class=\"";
    tableBuildString += i === 0 ? HOME_STATION_CLASS : ALT_CLASS;
    tableBuildString += "\" id=\"" + fieldArray[i] + "\" title=\"" + "NAME:\nMETAR:\nTAF:" + "\">" + fieldArray[i] +
      "</td>";
    tableBuildString += "</tr>";
  }
  document.getElementById("masterTable")
    .removeAttribute("hidden");
  document.getElementById("masterTable")
    .innerHTML = tableBuildString;
}

function addListeners() {
  // http://stackoverflow.com/questions/19655189/javascript-click-event-listener-on-class
  var fetchXml = function () {
    var stationList = this.getAttribute("value");
    buildTable(stationList);
    var xmlPages = [
      {
        "name": "fields",
        "action": processFieldData
      },
      {
        "name": "metars",
        "action": processMetarData
      },
      {
        "name": "tafs",
        "action": processTafData
      }
        ];
    xmlPages.forEach(function (page) {
      $.post("proxy.php", {
          url: makeUrl(page.name, stationList)
        })
        .done(function (data) {
          page.action(data);
        })
        .fail(function () {
          window.alert("fail!");
        });
    });
  };
  Array.from(document.getElementsByClassName("prebuilt"))
    .forEach(function (element) {
      element.addEventListener("click", fetchXml);
    });
}
addListeners();

function autoRunTestCase() {
  buildTable(TEST_CASE_STATIONS);
  var xmlPages = [
    {
      "name": "fields",
      "action": processFieldData
      },
    {
      "name": "metars",
      "action": processMetarData
      },
    {
      "name": "tafs",
      "action": processTafData
      }
        ];
  xmlPages.forEach(function (page) {
    $.post("proxy.php", {
        url: makeUrl(page.name, TEST_CASE_STATIONS)
      })
      .done(function (data) {
        page.action(data);
      })
      .fail(function () {
        window.alert("fail!");
      });
  });
}
autoRunTestCase();
