<?php
    /*******************************************************
        Controlla che i l'email sia unica
    ********************************************************/
    require_once '../dbconfig.php';
    
    // Controllo che l'accesso sia legittimo
    if (!isset($_GET["q"])) {
        echo '<link rel="icon" type="image/png" href="../img/favicon.png">';
        echo "Non dovresti essere qui";
        exit;
    }

    // Imposto l'header della risposta
    header('Content-Type: application/json');
    
    // Connessione al DB
    $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);

    // Leggo la stringa dell'email
    $email = mysqli_real_escape_string($conn, $_GET["q"]);

    // Costruisco la query
    $query = "SELECT Email FROM ACCOUNT WHERE Email = '$email'";

    // Eseguo la query
    $res = mysqli_query($conn, $query) or die(mysqli_error($conn));

    $json_array =  array('exists' => mysqli_num_rows($res) > 0 ? true : false);
    if(isset($_GET['id'])){
        $id = mysqli_real_escape_string($conn, $_GET['id']);
        $query2 = "SELECT Email FROM ACCOUNT WHERE Email = '$email' and id = $id ";
        $res2 = mysqli_query($conn, $query2);
        $json_array['isMine'] = mysqli_num_rows($res2) > 0 ? true : false;
    }
    // Torna un JSON con chiave exists e valore boolean

    // Chiudo la connessione
    $json = json_encode($json_array);
    echo $json;
    mysqli_close($conn);
?>