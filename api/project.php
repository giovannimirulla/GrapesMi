<?php
//$conn = mysqli_connect("localhost") or die(mysqli_connect_error());
require '../dbconfig.php';
$conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']) or die(mysqli_error($conn));

if(isset($_GET["q"])){
    $nome = mysqli_real_escape_string($conn, $_GET['q']);
    $queryProject = "SELECT * FROM progetto where Nome LIKE '$nome'";
    $projectResult = mysqli_query($conn, $queryProject) ;
    $project = mysqli_fetch_assoc($projectResult);
    if($project){
    $queryCollaborations = "SELECT Email,Username,Propic,Nome,Cognome from datiCollaborazioni where IDProgetto = ".$project['ID'];


    $collaborationResult = mysqli_query($conn, $queryCollaborations) ;
    $collaborationArray = array();
    while($row = mysqli_fetch_assoc($collaborationResult)) {
        $collaborationArray[] = $row;
    }
    $project["Collaborations"] = $collaborationArray;
   

    $queryOS = "SELECT distinct so.ID, so.Nome, so.Icona FROM storicodispositivi sto join so so on sto.NomeSO = so.Nome where sto.IDProgetto = ".$project['ID'];
    $OSResult = mysqli_query($conn, $queryOS) ;
    $OSArray = array();
    while($row = mysqli_fetch_assoc($OSResult)) {
        $OSArray[] = $row;
    }
    $project["OS"] = $OSArray;

    $queryDeviceNumber = "SELECT *  FROM registrazione r join scheda s on r.NumeroModelloDispositivo = s.NumeroModello where r.IDProgetto = ".$project['ID'];
    $deviceNumberResult = mysqli_query($conn, $queryDeviceNumber) ;
    $project["DeviceNumber"] = mysqli_num_rows($deviceNumberResult); 

    $queryDevices = "SELECT distinct s.Nome, s.Versione FROM registrazione r join scheda s on r.NumeroModelloDispositivo = s.NumeroModello where r.IDProgetto = ".$project['ID'];
   
    $devicesResult = mysqli_query($conn, $queryDevices) ;
    $devicesArray = array();
    $percentageArray = array();
    while($row = mysqli_fetch_assoc($devicesResult)) {
        $devicesArray[] = $row;
        $queryPercentage1 = "set @percentuale = 0;";
        $queryPercentage2 ="call percentualeDispositiviAggiornati(@percentuale, '".$nome."', '".$row["Nome"]."', NULL, NULL);";
        $queryPercentage3 = "select @percentuale;";
        mysqli_query($conn, $queryPercentage1) ;
        mysqli_query($conn, $queryPercentage2) ;
        $percentageResult = mysqli_query($conn, $queryPercentage3);
        while($p = mysqli_fetch_assoc($percentageResult)) {
            $percentageArray[$row["Nome"]]=round ( $p["@percentuale"]);
        }
    } 
    $project["UpdatedPercentage"] = $percentageArray;
    $project["Devices"] = $devicesArray;

    
    echo json_encode($project);
}else echo "{'Error':'Not found'}";
}
/*if(isset($_GET['q'])){
    $search = mysqli_real_escape_string($conn, $_GET['q']);
    $query = "SELECT distinct(s.Nome) FROM storicodispositivi sto join scheda s on sto.NumeroModelloDispositivo = s.NumeroModello where sto.NomeProgetto LIKE '%".$search."%'";
    $res = mysqli_query($conn, $query) ;
     $returnarray = array();
while($row = mysqli_fetch_assoc($res)) {
    $returnarray[] = $row;
}*/

mysqli_close($conn);
?>