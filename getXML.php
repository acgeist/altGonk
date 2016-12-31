<!DOCTYPE html>
<html>
  <head>
    <title>PHP Test</title>
  </head>

  <body>    
    <?php
        //Un-comment this line to display raw xml
        #header('Content-Type: application/xml');
        $url = "https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=KVAD%20KVLD%20KNIP%20KJAX%20KWRB%20KSAV%20KPAM%20KSVN%20KLSF%20KABY%20KTLH%20KGNV%20KDAB%20KAGS%20%20%20%20%20%20%20&hoursBeforeNow=24&mostRecentForEachStation=true";
        $ch = curl_init(); 
        curl_setopt_array($ch, array(
            CURLOPT_URL => $url,
            CURLOPT_HEADER => false,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => true
        ));

        /*
        Setting CURLOPT_SSL_VERIFYPEER to false will resolve difficulties in getting XML 
        docs to load.  However, it also is a significant security hole as it opens you
        up to man-in-the-middle attacks. Correct answer is to acquire an up-to-date CA root 
        certificate bundle (try https://curl.haxx.se/docs/caextract.html - it will be a ".pem" 
        file) and point cURL to it.  This involves opening your "php.ini" file, finding 
        "curl.cainfo", uncommenting it, and pointing it (absolute path) to the ".pem" file you
        downloaded (e.g. "curl.cainfo = C:\Apache24\htdocs\trustedCertificates\cacert.pem").
        Alternately, you can use "curl_setopt($ch,CURLOPT_CAINFO, getcwd() . '\cacert.pem');"
        and place the ".pem" file in that specific project's folder.
        See following references:
        http://unitstep.net/blog/2009/05/05/using-curl-in-php-to-access-https-ssltls-protected-sites/
        http://stackoverflow.com/questions/12305157/using-curlopt-cainfo-with-updated-ca-bundle-causes-certificate-verify-failed
        http://stackoverflow.com/questions/21187946/60-ssl-certificate-self-signed-certificate-in-certificate-chainbool
        */
        $result = curl_exec($ch);
        if($result === false){
            echo 'Curl error: ' . curl_error($ch);
        } else {
            echo 'XML Retrieved successfully. </br>';
            #echo $result;
        }
        curl_close($ch);

        /*
        //DOM Method
        //http://stackoverflow.com/questions/21858671/curl-loading-cross-domain-remote-xml-how-to-read-format-it
        $dom = new DOMDocument;
        $dom->loadXML($result);
        print_r ($dom);
        echo "</br>";
        */

        /*
        //SimpleXML method
        //http://php.net/manual/en/simplexmlelement.construct.php
        //http://php.net/manual/en/simplexml.examples-errors.php
        $sxe = new SimpleXMLElement($result);
        print_r($sxe);
        echo "</br>";
        */
    ?>
  </body>
</html>