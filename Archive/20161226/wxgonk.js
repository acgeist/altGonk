function myFunction(){
    document.getElementById("xh2").innerHTML = "Hello Dolly.";
}
function loadDoc() {
  var xhttp = new XMLHttpRequest();
  var xUrl = "https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=KVAD%20KVLD%20KNIP%20KJAX%20KWRB%20KSAV%20KPAM%20KSVN%20KLSF%20KABY%20KTLH%20KGNV%20KDAB&hoursBeforeNow=3&mostRecentForEachStation=true";
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     document.getElementById("demo").innerHTML = this.responseText;
     console.log(this.responseText);
    }
  };
  xhttp.open("GET", xUrl, true);
  xhttp.send();
}