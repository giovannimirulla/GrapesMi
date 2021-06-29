<?php
//$conn = mysqli_connect("localhost") or die(mysqli_connect_error());
require '../dbconfig.php';
$conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']) or die(mysqli_error($conn));
$query = "SELECT * FROM scheda";

if(isset($_GET['q'])){
    $search = mysqli_real_escape_string($conn, $_GET['q']);
    $query .= " WHERE Nome LIKE '%".$search."%'";
}
$res = mysqli_query($conn, $query) ;
$returnarray = array();
while($row = mysqli_fetch_assoc($res)) {
       $queryCompatibility = "SELECT so.* FROM scheda s join compatibilita c on s.NumeroModello = c.NumeroModelloScheda join so so on  c.IDSO = so.ID where s.NumeroModello = ".$row["NumeroModello"];
       $queryDescription = "SELECT ds.CPU, ds.GPU, ds.RAM, ds.Storage, ds.WiFi, ds.Bluetooth FROM scheda s join dati_scheda ds on s.NumeroModello = ds.NumeroModello  where s.NumeroModello = ".$row["NumeroModello"];
       $descriptionResult = mysqli_query($conn, $queryDescription);
       $compatibilityResult = mysqli_query($conn, $queryCompatibility);
        $osnarray = array();
        $dnarray = array();
        while($os = mysqli_fetch_assoc($compatibilityResult)) {
            $osnarray[]= $os;
        }
        while($d = mysqli_fetch_assoc($descriptionResult)) {
            $dnarray[]= $d;
        }
        $row["OS"] =  $osnarray;
        $row["Description"] =  $dnarray;
        $returnarray[] = $row;
}
echo json_encode($returnarray);
mysqli_close($conn);

?>