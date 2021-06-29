<?php
function get($key, $default=NULL) {
        return array_key_exists($key, $_GET) ? $_GET[$key] : $default;
      }
      
      function session($key, $default=NULL) {
        return array_key_exists($key, $_SESSION) ? $_SESSION[$key] : $default;
      }
      function alert($message) {
      
        // Display the alert box 
        echo "<script>alert('$message');</script>";
    }
      function apiRequest($url, $post=FALSE, $headers=array()) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url );
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
      
        if($post)
          curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
      
        $headers[] = 'Accept: application/vnd.github.v3+json';
        $headers[] = 'User-Agent: demo';
      
        if(session('access_token'))
          $headers[] = 'Authorization: token ' . session('access_token');
      
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
      
        $response=json_decode(curl_exec($ch), true);
          curl_close($ch);   
          return  $response;
      }
?>