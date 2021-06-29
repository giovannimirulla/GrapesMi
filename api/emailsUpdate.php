
<?php
//$conn = mysqli_connect("localhost") or die(mysqli_connect_error());
require '../dbconfig.php';
define('RestDBUsername', 'trytry-646a');
define('RestDBApiKey', '9c9c64d8c1fe3bf0a56892b423780995972de');

if(isset($_GET['sbc']) && isset($_GET['project'])){
    $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']) or die(mysqli_error($conn));
    
    $sbc = mysqli_real_escape_string($conn, $_GET['sbc']);
    $sbcArray = explode(" ",$_GET['sbc']);
    $sbcVersion = end($sbcArray);
    $sbcName = $sbc;
    if(!is_numeric($sbcVersion)){
        $sbcVersion = 1;
    } else{
        array_pop( $sbcArray);
        $sbcName = implode (" ",$sbcArray);
    }

    $sbcName = mysqli_real_escape_string($conn, $sbcName);
    $sbcVersion = mysqli_real_escape_string($conn, $sbcVersion);
    $project = mysqli_real_escape_string($conn, $_GET['project']);
   $query = "SELECT * FROM dispositiviregistrati where NomeDispositivo = '$sbcName' and VersioneDispositivo =  $sbcVersion and NomeProgetto = '$project'";

    $res = mysqli_query($conn, $query) ;
    $returnarray = array();
    while($row = mysqli_fetch_assoc($res)) {
        $returnarray[] = $row;

            if($sbcVersion>1){
                $sbcName = $sbcName. " ".$sbcVersion;
        }
    
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://" . RestDBUsername . ".restdb.io/mail" );
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    curl_setopt($ch, CURLOPT_POST, 1);

    $headers[] = "Content-Type: application/json";
    $headers[] = "Cache-Control: no-cache";
    $headers[] = "x-apikey:". RestDBApiKey;
    $headers[] = "X-Requested-With: XMLHttpRequest";

    $payload = json_encode( array( 
        "to"=>  $row["Email"],
        "subject"=> "Your device is about to be updated - Grapes Mi",
        "html" => "<div style='text-align:center'><h1>" . $row["NomeProgetto"]. "</h1><p>Your device <b>" . $sbcName . "</b> is about to be updated!</p><img style='display:block;max-width: 100%; height:auto;' src='" . $row["ImmagineDispositivo"] . "'/></div>",
        "company" => "Grapes Mi",
                "sendername" => "Grapes Mi"

        )
     );
   
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $payload );
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); 
    curl_exec($ch);
    curl_close($ch);    

    }
    echo json_encode($returnarray);
    mysqli_close($conn);
    
}


?>