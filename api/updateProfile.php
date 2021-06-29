<?php
//$conn = mysqli_connect("localhost") or die(mysqli_connect_error());
require '../dbconfig.php';
$conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']) or die(mysqli_error($conn));

$id = mysqli_real_escape_string($conn, $_GET['id']);
$value =  end($_GET);
$key =  key($_GET);
$query = "UPDATE `account` a  JOIN ANAGRAFICA_ACCOUNT aa on a.ID = aa.ID SET `$key` = '$value' WHERE (aa.`ID` = '$id');";

$res = mysqli_query($conn, $query) ;
mysqli_close($conn);

?>