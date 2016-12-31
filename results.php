<!DOCTYPE html>
<html>
  <head>
    <title>Wx Gonkulator</title>
    <!-- <link href="style.css" rel="stylesheet" type="text/css"> -->
    <!-- http://www.w3schools.com/jquery/jquery_get_started.asp -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>    
  </head>

  <body>
    <h1>Wx Gonkulator for SOFs/Top 3s</h1>
    <button id="b2" onclick="runTest()">Get XML</button></br>
    <a href="/altGonk/getXML.php">PHP Test</a></br>

    <h3>URL used:</h3>
    <p id="p3">xmlUrl goes here.</p>
    <h3>Results from PHP proxy:</h3>
    <div id="xml"></div>

    <script src="wxgonk.js"></script>
    <script>
      function runTest(){
        var url = "https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=KVAD%20KVLD%20KNIP%20KJAX%20KWRB%20KSAV%20KPAM%20KSVN%20KLSF%20KABY%20KTLH%20KGNV%20KDAB&hoursBeforeNow=24&mostRecentForEachStation=true";
        reqXmlFromProxy(url);
      }
    </script>
  </body>
</html>