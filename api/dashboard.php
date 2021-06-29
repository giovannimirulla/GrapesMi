<?php
//$conn = mysqli_connect("localhost") or die(mysqli_connect_error());
require '../dbconfig.php';
$conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']) or die(mysqli_error($conn));
if(isset($_GET['id'])){

    $id = mysqli_real_escape_string($conn, $_GET['id']);
    $query = "SELECT * FROM schedePerProgetti where IDAccount = '$id'";
    $res = mysqli_query($conn, $query) ;
    $returnarray = array();
    while($row = mysqli_fetch_assoc($res)) {
        $returnarray[] = $row;
    }
    echo json_encode($returnarray);
    mysqli_close($conn);
}else echo "{'Error':'Not found'}";

?>
