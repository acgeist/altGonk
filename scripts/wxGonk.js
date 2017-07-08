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
-Write more/better tests for everything.
-Add worst-case data to text of cells
-Add TAF text to titles of cells
-Dig into rounding issues/decide how to handle.
*/
const TEST_CASE_STATIONS = "KPOE MMMD KUTS KGLS KJCT";
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
const STOPLIGHT_GREEN_CLASS = "greenLight"; //"bg-success";
const STOPLIGHT_YELLOW_CLASS = "yellowLight"; //"bg-warning";
const STOPLIGHT_RED_CLASS = "redLight"; //"bg-danger";
const HOME_STATION_CLASS = "homeStation"; //"bg-primary";
const ALT_CLASS = "alternate"; //"bg-info";
const METAR_STALE_TIME = 1000 * 60 * 90; //90 minutes

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
    return "https://www.aviationweather.gov/adds/dataserver_current/current/";
  }
  return ["https://www.aviationweather.gov", "/adds", "/dataserver_current", "/httpparam?", "requestType=retrieve",
        "&format=xml", "&dataSource=", ending, stationList.replace(/\s/g, "%20")].join("");
}

function hasCeil(skyCondNode) {
  if (skyCondNode === undefined){
    return false;
  } else if (Array.isArray(skyCondNode)) {
    return skyCondNode.filter(function (layer) {
        var type = layer["@attributes"].sky_cover;
        return type === "BKN" || type === "OVC" || type === "OVX";
      }).length > 0;
  } else {
    var type = skyCondNode["@attributes"]["sky_cover"];
    return type === "BKN" || type === "OVC" || type === "OVX";
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

function canFile(wxJson, useCirclAppch = false) {
  //TODO: rewrite this more efficiently/succinctly
  if (!useCirclAppch && wxJson.visibility_statute_mi !== undefined) {
    return wxJson.visibility_statute_mi >= FILING_MINS.vis;
  } else if (useCirclAppch && wxJson.visibility_statute_mi !== undefined) {
    return wxJson.visibility_statute_mi >= FILING_MINS.vis && 
    getCeilFromSkyCond(wxJson.sky_condition) >= FILING_MINS.ceiling;
  } else if (!useCirclAppch && wxJson.visibility_statute_mi === undefined) {
    return true;
  } else if (useCirclAppch && wxJson.visibility_statute_mi === undefined) {
    return getCeilFromSkyCond(wxJson.sky_condition) >= FILING_MINS.ceiling;
  }
}

function altReqd(wxJson) {
  return (wxJson.visibility_statute_mi === undefined ? false : wxJson.visibility_statute_mi < ALT_REQ.vis) ||
    getCeilFromSkyCond(wxJson.sky_condition) < ALT_REQ.ceiling;
}

function isValidAlt(wxJson) {
  return (wxJson.visibility_statute_mi === undefined ? true : wxJson.visibility_statute_mi >= ALT_MINS.vis) &&
    getCeilFromSkyCond(wxJson.sky_condition) >= ALT_MINS.ceiling;
}

function belowMinsForTempShwrs(forecast) {
  return ((forecast.visibility_statute_mi === undefined ? false : forecast.visibility_statute_mi < ALT_MINS.vis) ||
      getCeilFromSkyCond(forecast.sky_condition) < ALT_REQ.ceiling) && (/(TS|SHRA|SHSN)/i.test(forecast.wx_string)) &&
    /TEMPO/i.test(forecast.change_indicator);
}

function getStoplightClassFromMetar(metarJson, isHomeStation = false) {
  if (isHomeStation && !canFile(metarJson)) {
    //console.log("getStoplightClassFromMetar(" + metarJson.raw_text + ", isHomeStation = " + isHomeStation +
    //  ") --> RED.")
    return STOPLIGHT_RED_CLASS;
  } else if (isHomeStation && altReqd(metarJson)) {
    //console.log("getStoplightClassFromMetar(" + metarJson.raw_text + ", isHomeStation = " + isHomeStation +
    //  ") --> YELLOW.")
    return STOPLIGHT_YELLOW_CLASS;
  } else if (isHomeStation) {
    //console.log("getStoplightClassFromMetar(" + metarJson.raw_text + ", isHomeStation = " + isHomeStation +
    //  ") --> GREEN.")
    return STOPLIGHT_GREEN_CLASS;
  } else if (!isValidAlt(metarJson)) {
    //console.log("getStoplightClassFromMetar(" + metarJson.raw_text + ", isHomeStation = " + isHomeStation +
    //  ") --> RED.")
    return STOPLIGHT_RED_CLASS;
  } else {
    //console.log("getStoplightClassFromMetar(" + metarJson.raw_text + ", isHomeStation = " + isHomeStation +
    //  ") --> GREEN.")
    return STOPLIGHT_GREEN_CLASS;
  }
}

function getStoplightClassFromTaf(tafJson, isHomeStation = false) {
  if (isHomeStation && !canFile(tafJson)) {
    // console.log("tafStoplight(" + getCeilFromSkyCond(tafJson.sky_condition) + "/" + tafJson.visibility_statute_mi +
    //   "SM, isHomeStation = " + isHomeStation + ") --> RED.")
    return STOPLIGHT_RED_CLASS;
  } else if (isHomeStation && altReqd(tafJson)) {
    // console.log("tafStoplight(" + getCeilFromSkyCond(tafJson.sky_condition) + "/" + tafJson.visibility_statute_mi +
    //   "SM, isHomeStation = " + isHomeStation + ") --> YELLOW.")
    return STOPLIGHT_YELLOW_CLASS;
  } else if (isHomeStation) {
    // console.log("tafStoplight(" + getCeilFromSkyCond(tafJson.sky_condition) + "/" + tafJson.visibility_statute_mi +
    //   "SM, isHomeStation = " + isHomeStation + ") --> GREEN.")
    return STOPLIGHT_GREEN_CLASS;
  } else if (!isValidAlt(tafJson)) {
    // console.log("tafStoplight(" + getCeilFromSkyCond(tafJson.sky_condition) + "/" + tafJson.visibility_statute_mi +
    //   "SM, isHomeStation = " + isHomeStation + ") --> RED.")
    return STOPLIGHT_RED_CLASS;
  } else if (belowMinsForTempShwrs(tafJson)) {
    // console.log("tafStoplight(" + getCeilFromSkyCond(tafJson.sky_condition) + "/" + tafJson.visibility_statute_mi +
    //   "SM, isHomeStation = " + isHomeStation + ") --> YELLOW.")
    return STOPLIGHT_YELLOW_CLASS;
  } else {
    // console.log("tafStoplight(" + getCeilFromSkyCond(tafJson.sky_condition) + "/" + tafJson.visibility_statute_mi +
    //   "SM, isHomeStation = " + isHomeStation + ") --> GREEN.")
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

function getLocalFromIsoZulu(zuluTime){
  var offset = +(new Date().toString().match(/([\+-][0-9][0-9])/)[1]),
    year = +zuluTime.replace(/^"?(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z"?$/i, "$1"),
    //Subtract one from the month since Javascript uses zero-subscripting (e.g. February = 1).
    month = +zuluTime.replace(/^"?(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z"?$/i, "$2") - 1,
    date = +zuluTime.replace(/^"?(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z"?$/i, "$3"),
    hours = +zuluTime.replace(/^"?(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z"?$/i, "$4");
  //console.log("Converting " + zuluTime + ". Changing hours from " + hours + " to " + +(hours + offset));
  return new Date(year, month, date, (hours + offset));
}

//Ensure that the worst case is the one that gets reported (i.e. an optimistic TAF
//won't overrule poor current conditions)
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
      //var cell = document.createElement("td");
      var cell = fieldIdCell.nextSibling;
      cell.setAttribute("class", qcStoplight(getStoplightClassFromMetar(field, fieldIdCell.parentElement.rowIndex ===
        1), cell.getAttribute("class")));
      /*
      cell.innerHTML = ("00" + (getCeilFromSkyCond(field.sky_condition) / 100))
        .slice(-3) + "/" + field.visibility_statute_mi + "SM";
      */
      cell.setAttribute("title", field.raw_text);
    });
}
var processTafData = function (tafJson) {
  //printRawJson(tafJson);
  JSON.parse(tafJson)["data"]["TAF"].forEach(function (field) {
    //console.log("****************" + field.station_id + "****************");
    var fieldIdCell = document.querySelector("#" + field.station_id);
    var fieldIdRow = fieldIdCell.parentElement;
    fieldIdCell.setAttribute("title", fieldIdCell.getAttribute("title")
      .replace(/TAF:/i, "TAF:\n" + field.raw_text.replace(/(TEMPO|FM|BECMG)/gi, "\n$1")));
    if (Array.isArray(field.forecast)) {
      field.forecast.forEach(tafLine => {
        // console.log("Looking at a TAF line that goes from " + tafLine.fcst_time_from + " to " + tafLine.fcst_time_to);
        // console.log("Converting those times to local: " + getLocalFromIsoZulu(tafLine.fcst_time_from) + "-->" + getLocalFromIsoZulu(tafLine.fcst_time_to));
        for (var i = 1; i < fieldIdRow.cells.length; i++) {
          //console.log("Comparing it to a cell that starts at " + fieldIdRow.cells[i].getAttribute("data-starttime"));
          if (new Date(fieldIdRow.cells[i].getAttribute("data-starttime")) >= getLocalFromIsoZulu(tafLine.fcst_time_from) &&
            new Date(fieldIdRow.cells[i].getAttribute("data-starttime") < getLocalFromIsoZulu(tafLine.fcst_time_to))
          ) {
            fieldIdRow.cells[i].setAttribute("class", qcStoplight(getStoplightClassFromTaf(tafLine, fieldIdRow.rowIndex === 1)));
          }
        }
      });
    } else {
      // console.log("Looking at a TAF line that goes from " + field.forecast.fcst_time_from + " to " + field.forecast.fcst_time_to);
      // console.log("Converting those times to local: " + getLocalFromIsoZulu(field.forecast.fcst_time_from) + "-->" + getLocalFromIsoZulu(field.forecast.fcst_time_to));
      for (var i = 1; i < fieldIdRow.cells.length; i++) {
        //console.log("Comparing it to a cell that starts at " + fieldIdRow.cells[i].getAttribute("data-starttime"));
        if (new Date(fieldIdRow.cells[i].getAttribute("data-starttime")) >= getLocalFromIsoZulu(field.forecast.fcst_time_from) &&
          new Date(fieldIdRow.cells[i].getAttribute("data-starttime") < getLocalFromIsoZulu(field.forecast.fcst_time_to))
        ) {
          fieldIdRow.cells[i].setAttribute("class", qcStoplight(getStoplightClassFromTaf(field.forecast, fieldIdRow.rowIndex === 1)));
        }
      }
    }
  });
}

// function printRawJson(jsonString) {
//   document.body.removeChild(document.body.lastChild);
//   var rawJson = document.createElement("pre");
//   rawJson.innerHTML = JSON.stringify($.parseJSON(jsonString), null, 2);
//   document.body.appendChild(rawJson);
// }

function buildTable(fieldNames, hours = 12) {
  var fieldArray = fieldNames.split(" "),
    currTime = new Date(),
    offset = +currTime.toString().match(/([\+-][0-9][0-9])/)[1],
    currLocalHour = currTime.getHours(),
    currUtcHour = currTime.getUTCHours(),
    table = document.createElement("table"),
    tempTr = document.createElement("tr"),
    tempTh = document.createElement("th"),
    tempTd;
  tempTh.innerHTML = "UTC Offset: " + offset + "<br>UTC Day: " + currTime.getUTCDate()
  tempTr.appendChild(tempTh);
  for (let i = 0; i < hours; i++) {
    tempTh = document.createElement("th");
    tempTh.innerHTML = (currLocalHour + i) % 24 + "L<br>" + (currUtcHour + i) % 24 + "Z";
    tempTr.appendChild(tempTh);
  }
  table.appendChild(tempTr);
  fieldArray.forEach((field, i) => {
    tempTr = document.createElement("tr");
    tempTd = document.createElement("td");
    tempTd.setAttribute("class", i === 0 ? HOME_STATION_CLASS : ALT_CLASS);
    tempTd.setAttribute("id", field);
    tempTd.setAttribute("title", "NAME:\nMETAR:\nTAF:");
    tempTd.innerHTML = field;
    tempTr.appendChild(tempTd);
    for (let j = 0; j < hours; j++) {
      tempTd = document.createElement("td");
      tempTd.setAttribute("data-ICAO", field);
      // console.log("New Date (offset = " + offset + ", j = " + j + ") = " + 
      //   new Date(currTime.getFullYear(),currTime.getMonth(),currTime.getDate(),currTime.getHours() + j));
      tempTd.setAttribute("data-startTime", new Date(currTime.getFullYear(),currTime.getMonth(),currTime.getDate(),currTime.getHours() + j));
      tempTr.appendChild(tempTd);
    }
    table.appendChild(tempTr);
  });
  table.setAttribute("class", "table table-sm table-bordered table-inverse");
  table.setAttribute("id", "wxTable");
  return table;
}
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError("Array.from requires an array-like object - not null or undefined");
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}
function addListeners() {
  // http://stackoverflow.com/questions/19655189/javascript-click-event-listener-on-class
  var fetchXml = function () {
    var stationList = this.getAttribute("value");
    var tableDiv = document.querySelector("#tableContainer");
    while (tableDiv.firstChild) {
      tableDiv.removeChild(tableDiv.firstChild);
    }
    tableDiv.appendChild(buildTable(stationList));
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
      //$.post("http://ec2-34-204-225-71.compute-1.amazonaws.com/proxy.php", {
      $.post("http://localhost/altGonk/proxy.php", {
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
  var tableDiv = document.querySelector("#tableContainer");
  while (tableDiv.firstChild) {
    tableDiv.removeChild(tableDiv.firstChild);
  }
  tableDiv.appendChild(buildTable(TEST_CASE_STATIONS));
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
