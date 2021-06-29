<?php
//$conn = mysqli_connect("localhost") or die(mysqli_connect_error());
require '../dbconfig.php';
$conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']) or die(mysqli_error($conn));
if(isset($_GET['sbc']) && isset($_GET['project'])){

    $project = mysqli_real_escape_string($conn, $_GET['project']);
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
    
    $query = "SELECT so.Nome from COMPATIBILITA c join SCHEDA s on c.NumeroModelloScheda = s.NumeroModello join SO so on c.IDSO = so.ID where s.Nome = '$sbcName' and s.Versione = $sbcVersion";

    $res = mysqli_query($conn, $query) ;
    $returnarray = array();
    while($row = mysqli_fetch_assoc($res)) {
        $returnarray[] = $row;
        $queryUpdate = "call aggiornaDispositivi('$project','".$row["Nome"]."')";
        mysqli_query($conn, $queryUpdate) ;
    }
    echo "{'Success':'All updated'}";
    mysqli_close($conn);
}else echo "{'Error':'Not found'}";

?>
