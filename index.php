<!doctype html>
<html lang="en-US">

<head>
  <title>Wx Gonkulator</title>
  <meta charset="utf-8">
  <meta name="description" content="Wx Gonkulator fore SOFs">
  <meta name="keywords" content="weather, ADDS, AWC, USAF, METAR, TAF">
  <meta name="author" content="Andrew Geist">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">
  <link rel="shortcut icon" href="favicon.ico">
  <!-- Latest compiled and minified Bootstrap CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css" integrity="sha384-AysaV+vQoT3kOAXZkl02PThvDr8HYKPZhNT5h/CXfBThSRXQ6jW5DO2ekP5ViFdi"
    crossorigin="anonymous">
  <!-- My own CSS stuff -->
  <link rel="stylesheet" href="style.css">
  <style>

  </style>
</head>

<body>
  <div class="container-fluid">
    <div class="d-block">
    <header class="text-xs-center">
      <h1 class="text-primary">Wx Gonkulator for SOFs/Top 3s</h1>
    </header>
    </div>
    <div class="row">
      <a href="#">
        <div class="col-xs-3">
          <img src="pics/moody.jpg" alt="Moody AFB, GA" title="Moody AFB, GA">
          <h5><abbr title="Moody AFB, GA">KVAD</abbr></h5>
        </div>
      </a>
      <a href="#">
        <div class="col-xs-3">
          <img src="pics/davis-monthan.jpg" alt="Davis-Monthan AFB, AZ" title="Davis-Monthan AFB, AZ">
          <h5><abbr title="Davis-Monthan AFB, AZ">KDMA</abbr></h5>
        </div>
      </a>
      <a href="#">
        <div class="col-xs-3">
          <img src="pics/osan.jpg" alt="Osan AB, ROK" title="Osan AB, ROK">
          <h5><abbr title="Osan AB, ROK">RKSO</abbr></h5>
        </div>
      </a>
      <a href="#">
        <div class="col-xs-3">
          <img src="pics/nellis.png" alt="Nellis AFB, NV" title="Nellis AFB, NV">
          <h5><abbr title="Osan AB, ROK">KLSV</abbr></h5>
        </div>
      </a>
    </div>
    <footer class="">
      <h4 class="">Feedback to Fore!</h4>
    </footer>
  </div>
  <!-- Latest compiled Bootstrap JavaScript -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js" integrity="sha384-3ceskX3iaEnIogmQchP8opvBy3Mi7Ce34nWjpBIwVTHfGYWQS9jwHDVRnpKKHJg7"
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.3.7/js/tether.min.js" integrity="sha384-XTs3FgkjiBgo8qjEjBk0tGmf3wPrWtA6coPfQDfFEY8AnYJwjalXCiosYRBIBZX8"
    crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/js/bootstrap.min.js" integrity="sha384-BLiI7JTZm+JWlgKa0M0kGRpJbF2J8q+qreVrKBC47e3K6BW78kGLrCkeRX6I9RoK"
    crossorigin="anonymous"></script>
  <!-- jQuery library -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <!-- look this up - do I understand correctly that scripts should go at the bottom of the HTML code? -->
  <script>
    $(document).ready(function () {
      $("h5").addClass("text-xs-center");
      $("img").addClass("img-thumbnail");
    });
  </script>
</body>

</html>