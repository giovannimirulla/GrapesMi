<?php
//$conn = mysqli_connect("localhost") or die(mysqli_connect_error());
require '../dbconfig.php';
$conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']) or die(mysqli_error($conn));
$query = "SELECT * FROM progetto";

if(isset($_GET['q'])){
    $search = mysqli_real_escape_string($conn, $_GET['q']);
    $query .= " WHERE Nome LIKE '%".$search."%'";
}
if(isset($_GET['random'])){
    $query .= " ORDER BY RAND ()";
}
if(isset($_GET['limit'])){
    $limit = mysqli_real_escape_string($conn, $_GET['limit']);
     $query .= " LIMIT ".$limit;
    }
$res = mysqli_query($conn, $query) ;
$returnarray = array();
while($row = mysqli_fetch_assoc($res)) {
    $returnarray[] = $row;
}
echo json_encode($returnarray);
mysqli_close($conn);

?>