<?php
require '../dbconfig.php';
if (!isset($_GET["q"])) {
    echo "Non dovresti essere qui";
    exit;
}
header("Content-Type: application/json");
$conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);
$username = mysqli_real_escape_string($conn, $_GET['q']);
$query = "SELECT username FROM ACCOUNT WHERE username = '$username'";
$res = mysqli_query($conn, $query);
$json_array = array('exists' => mysqli_num_rows($res) > 0 ? true : false);


if(isset($_GET['id'])){
    $id = mysqli_real_escape_string($conn, $_GET['id']);
    $query2 = "SELECT username FROM ACCOUNT WHERE username = '$username' and id = $id ";
    $res2 = mysqli_query($conn, $query2);
    $json_array['isMine'] = mysqli_num_rows($res2) > 0 ? true : false;
}

$json = json_encode($json_array);
echo $json;
mysqli_close($conn);
?>