<?php
#http://blog.mesmotronic.com/index.php/p/251
    #$url = $_REQUEST['url'];
    #if (preg_match('/\b(https?|ftp):\/\/*/', $url) !== 1) die;
    #echo (file_get_contents($url));
#https://www.sitepoint.com/php-xml-to-json-proxy/
    ini_set('display_errors', true);
    set_exception_handler('ReturnError');
    $result = '';
    $url = (isset($_POST['url']) ? $_POST['url'] : null);
    // echo "<h4>I (the proxy) was sent the following url: </h4><p>" . $url . "</p>";
    if ($url){
        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_URL => $url,
            CURLOPT_HEADER => false,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => true
        ));
        $result = curl_exec($ch);
        curl_close($ch);
    }
    if ($result){
        //Option 1
        // echo '<h4>Here\'s the raw text of what I got back: </h4>';
        // echo '<p>' . $result . '</p>';
        
        //Option 2
        //echo '<h4>Here it is formatted as a SimpleXmlElement: </h4><p>';
        //print_r(new SimpleXMLElement($result));
        //echo '</p>';
        
        //Option 3
        //echo '<h4>Here is the SimpleXmlElement using json_encode: </h4><p>';
        echo json_encode(new SimpleXMLElement($result));
        //echo '</p>';
    } else {
        ReturnError();
    }
    // return JSON error flag
    function ReturnError(){
        echo'{"error":true}';
    }
?>