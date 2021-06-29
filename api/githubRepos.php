<?php
$ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://api.github.com/user/repos?type=owner" );
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
      
        $headers[] = 'Accept: application/vnd.github.v3+json';
       $headers[] = 'User-Agent: demo';
      
          $headers[] = 'Authorization: token ' . $_GET["token"];
      
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
      
        echo  curl_exec($ch);
          curl_close($ch);   
    
      ?>