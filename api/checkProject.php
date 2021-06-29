<?php
require '../dbconfig.php';
if (!isset($_GET["q"])) {
    echo "Non dovresti essere qui";
    exit;
}
header("Content-Type: application/json");
$conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);
$name = mysqli_real_escape_string($conn, $_GET['q']);
$query = "SELECT Nome FROM progetto WHERE Nome = '$name'";
$res = mysqli_query($conn, $query);
$json_array = array('exists' => mysqli_num_rows($res) > 0 ? true : false);


$json = json_encode($json_array);
echo $json;
mysqli_close($conn);
?>