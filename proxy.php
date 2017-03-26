<?php
#https://www.sitepoint.com/php-xml-to-json-proxy/
    ini_set('display_errors', true);
    set_exception_handler('ReturnError');
    $result = '';
    $url = (isset($_POST['url']) ? $_POST['url'] : null);
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
        echo json_encode(new SimpleXMLElement($result));
    } else {
       returnError(); 
    }
    function returnError(){
        echo'{"error":true}'; 
    }
?>