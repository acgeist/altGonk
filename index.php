<!doctype html>
<html lang="en-US">
  <head>
    <title>Wx Gonkulator</title>
    <meta charset="UTF-8">
    <meta name="description" content="Wx Gonkulator fore SOFs">
    <meta name="keywords" content="weather, ADDS, AWC, USAF, METAR, TAF">
    <meta name="author" content="Andrew Geist">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>    
  </head>

  <body>
    <div class="w3-container w3-light-blue" style="margin-left:10%;margin-right:10%;">
    <header class="w3-panel w3-indigo w3-card-2"><h1>Wx Gonkulator for SOFs/Top 3s</h1></header>
    <img src="a10sil.gif" style="width:100px;height:100px"></img>
    <form action = "results.php" method="get"><fieldset class="w3-card-2">
      <legend>Input:</legend>
      Home Station:<br>
      <select name="bases">
          <option value="kvad" selected>KVAD</option>
          <option value="kdma">KDMA</option>
          <option value="rkso">RKSO</option>
          <option value="klsv">KLSV</option>
          <option value="khif">KHIF</option>
          <option value="paei">PAEI</option>
          <option value="etad">ETAD</option>
      </select>  
      <input type="text" name="homeStation" value = "KVAD"></input></br>
      Alternates:<br>
      <input type="text" name="alternates" value = "KVLD KNIP KJAX KWRB KSAV KPAM KSVN KLSF KABY KTLH KGNV KDAB"></input><br>
      <input type="submit" value="Submit">
    </fieldset></form>

    <form action="action_page.php">
  <input list="browsers" name="browser">
  <datalist id="browsers">
    <option value="Internet Explorer">
    <option value="Firefox">
    <option value="Chrome">
    <option value="Opera">
    <option value="Safari">
  </datalist>
  <input type="submit">
</form>
  
  <footer class="w3-panel w3-indigo w3-card-2"><h2>Footer</h2></footer>
  </div>
  </body>
</html>