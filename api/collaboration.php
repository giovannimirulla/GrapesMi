<?php
require '../dbconfig.php';

header("Content-Type: application/json");
$conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);
$id = mysqli_real_escape_string($conn, $_GET['id']);

if(!isset($_GET['project'])){
    $query = "SELECT * FROM collaborazione c join progetto p on c.IDProgetto = p.ID where c.IDAccount = '$id'";
    $res = mysqli_query($conn, $query) ;
    $returnarray = array();
    while($row = mysqli_fetch_assoc($res)) {
        $returnarray[] = $row;
    }
    echo json_encode($returnarray);
}else{
    $project = mysqli_real_escape_string($conn, $_GET['project']);
$query = "SELECT * from collaborazione c join progetto p on c.IDProgetto = p.ID where c.IDAccount  = '$id' and p.Nome = '$project'";
$res = mysqli_query($conn, $query);
if(isset($_GET['toogle'])){
    $queryToogle="call toogleCollaborazione('$project',$id)";
    mysqli_query($conn, $queryToogle);
    $json_array = array('completed' =>true);
    $json = json_encode($json_array);
echo $json;
}else{
$json_array = array('exists' => mysqli_num_rows($res) > 0 ? true : false);
$json = json_encode($json_array);
echo $json;
}
}
mysqli_close($conn);
?>