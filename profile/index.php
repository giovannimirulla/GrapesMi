<?php
require_once '../auth.php';
if (!$userid = checkAuth()) {
    header("Location: ../join");
    exit;
}
?>

<?php 
   // Verifica l'esistenza di dati POST
   if (!empty($_POST["NomeProgetto"]) && isset($_FILES['ImmagineProgetto']))
{
    $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']) or die(mysqli_error($conn));
    $error = array();
        # USERNAME
    // Controlla che l'username rispetti il pattern specificato
    if (!preg_match('/^[a-zA-Z0-9_-]{1,15}$/', $_POST['NomeProgetto'])) {
        $error[] = "Username non valido";
    } else {
        $name = mysqli_real_escape_string($conn, $_POST['NomeProgetto']);
        // Cerco se l'username esiste già o se appartiene a una delle 3 parole chiave indicate
        $query = "SELECT Nome FROM progetto WHERE Nome = '$name'";
        $res = mysqli_query($conn, $query);
        if (mysqli_num_rows($res) > 0) {
            $error[] = "Username già utilizzato";
        }
    }
     # UPLOAD DELL'IMMAGINE DEL PROFILO  
     $fileDestination = "";
     if (count($error) == 0) {
        if (!empty($_FILES['ImmagineProgetto']["name"])) {
            $file = $_FILES['ImmagineProgetto'];
            $type = exif_imagetype($file['tmp_name']);
            $allowedExt = array(IMAGETYPE_PNG => 'png', IMAGETYPE_JPEG => 'jpg', IMAGETYPE_GIF => 'gif');
            if (isset($allowedExt[$type])) {
                if ($file['error'] === 0) {
                    if ($file['size'] < 7000000) {
                        $fileDestination = '/img/projects/' . $_POST['NomeProgetto'].".".$allowedExt[$type];
                        move_uploaded_file($file['tmp_name'], "..".$fileDestination);
                    } else {
                        $error[] = "L'immagine non deve avere dimensioni maggiori di 7MB";
                    }
                } else {
                    $error[] = "Errore nel carimento del file";
                }
            } else {
                $error[] = "I formati consentiti sono .png, .jpeg, .jpg e .gif";
            }
        }else {
            $error[] = "Deve esserci l'immagine";
        }
    }

        # REGISTRAZIONE NEL DATABASE
        if (count($error) == 0) {
            $name = mysqli_real_escape_string($conn, $_POST['NomeProgetto']);
            $description = mysqli_real_escape_string($conn, $_POST['Descrizione']);


            $query = "INSERT INTO PROGETTO (`Nome`, Descrizione, Logo)
            VALUES ('$name', '$description', 'http://localhost/hw1/$fileDestination')";

            if (mysqli_query($conn, $query)) {
                $error[] = "Tutto ok";
            } else {
                $error[] = "Errore di connessione al Database";
            }
        }
    
        mysqli_close($conn);
}else if (!empty($_POST["NomeProgetto"]) && empty($_FILES['ImmagineProgetto']["name"])) alert("Manca l'immagine");
?>

<!DOCTYPE html>
<html lang="it">
<?php
$conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);
$userid = mysqli_real_escape_string($conn, $userid);
$query = "SELECT * FROM ACCOUNT A JOIN ANAGRAFICA_ACCOUNT AA ON A.ID = AA.ID WHERE A.Email = '$userid'";
$res_1 = mysqli_query($conn, $query);
$userinfo = mysqli_fetch_assoc($res_1);
?>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <link rel="stylesheet" href="../style.css">
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="../img/favicon.png">
    <script src="../js/contents.js" defer="true"></script>
    <script>
        let user = "<?php echo $userinfo["ID"]; ?>";
        let data = <?php echo json_encode(apiRequest("https://api.github.com/user/repos?type=owner")); ?>; // Don't forget the extra semicolon!
    let token =  "<?php echo session('access_token'); ?>";
    </script>
    <script src="js/scriptSBC.js" defer="true"></script>
    <script src="js/scriptGitHub.js" defer="true"></script>
    <script src="js/scriptProjects.js" defer="true"></script>
    <script src="js/scriptRestDB.js" defer="true"></script>
    <script src="js/profile.js" defer="true"></script>

    <script src="js/script.js" defer="true"></script>
    <script src="js/dashboard.js" defer="true"></script>

    <title>Profile - Grapes Mi</title>
</head>

<body>
    <header class="small profile">
        <nav>
            <div class="navButtons">
                <a id="navLogo" href="/hw1">
                    <img src="../img/icon/logo.svg" height="50" width="50" />
                    <h2>Grapes Mi</h2>
                </a>
                <form name='search' method='get' action="/hw1/search" class="textBar rightCorner bordered" id="searchProjectsBar" enctype="multipart/form-data" autocomplete="off">
                    <div class="input">
                        <input type="text" id="text" name="q" placeholder="Search...">
                    </div>
                    <button class="button" type="submit" value="">
                        <img src="../img/icon/search.svg " height="25" width="25" />
                    </button>
                </form>
            </div>
            <div class="navButtons">
                <a href='/hw1/profile' id='profileButton' class="<?php if (!$userid) {
                                                                        echo "hidden";
                                                                    } ?>">
                    <img class="propic  <?php if (empty($userinfo['Propic'])) echo "hidden" ?>" <?php if (isset($userinfo['Propic'])) echo "src='" . $userinfo['Propic'] . "'" ?> class="<?php if (!isset($userinfo['Propic'])) echo "hidden" ?>"></img>
                    <p class="propic <?php if (!empty($userinfo['Propic'])) echo "hidden" ?>">
                        <?php if (empty($userinfo['Propic']))
                            if (!empty($userinfo['Nome'][0]) || !empty($userinfo['Cognome']))
                                echo strtoupper($userinfo['Nome'])[0] . strtoupper($userinfo['Cognome'])[0];
                            else echo strtoupper($userinfo['Username'])[0];
                        ?></p>
                    <p class='username <?php if (!$userid) {
                                            echo "hidden";
                                        } ?>'><?php if ($userid) echo "@" . $userinfo['Username']; ?> </p>
                </a>
            </div>
        </nav>
    </header>

    <section class="dashboard" id="profile">
        <div class="menu">
            <div class="dataProfile">
                <img class="propic  <?php if (empty($userinfo['Propic'])) echo "hidden" ?>" <?php if (!empty($userinfo['Propic'])) echo "src='" . $userinfo['Propic'] . "'" ?> class="<?php if (!isset($userinfo['Propic'])) echo "hidden" ?>"></img>
                <p class="propic <?php if (!empty($userinfo['Propic'])) echo "hidden" ?>"> <?php if (empty($userinfo['Propic']))
                                                                                                if (!empty($userinfo['Nome'][0]) || !empty($userinfo['Cognome']))
                                                                                                    echo strtoupper($userinfo['Nome'])[0] . strtoupper($userinfo['Cognome'])[0];
                                                                                                else echo strtoupper($userinfo['Username'])[0];
                                                                                            ?></p>
                <div class="info">
                    <h3 class="bold"><?php if (!empty($userinfo['Nome'])) {
                                            echo $userinfo['Nome'];
                                        } ?><?php if (!empty($userinfo['Cognome'])) {
                                                echo " " . $userinfo['Cognome'];
                                            } ?></h3>
                    <p <?php if (empty($userinfo['Nome']) && empty($userinfo['Cognome'])) echo "class=bold" ?>><?php echo $userinfo['Email'] ?></p>
                </div>
            </div>
        </div>
        <div class="container">
            <div id="Deploy" class="page">
                <div class="stepsBar" id="stepsBar"></div>
                <h1>Deploy</h1>
                <div>
                    <div class="hidden" id="selected">
                        <div class="cards">
                            <a class="nextButton" id="selectedNext"><img src="../img/icon/right-arrow.svg" height="25" width="25" /></a>
                        </div>
                    </div>
                    <div>
                        <div class="textBar rightCorner bordered" id="searchContentsBar">
                            <div class="input">
                                <input type="text" id="search" name="project">
                            </div>
                            <div class="button">
                                <a>
                                    <img src="../img/icon/search.svg " height="25" width="25" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="search" id="notify">
                            <h2>Wait a moment</h2>
                            <p>I'm loading data for you...</p>
                        </div>
                        <div class="main cards hidden"></div>
                        <div class="title hidden" id="easterEgg">
                            <h2>I think you should close some description</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div id="Dashboard" class="page">
                <h1>Dashboard</h1>
                <div class="empty hidden" id="notify">
                            <h2>Look at that muscles!</h2>
                            <p>Come on then! Go to add some projects</p>
                        </div>
                <div class="main cards"></div>
            </div>
            <div id="Profile" class="page">
                <h1>Profile</h1>
                <div class="allSpace centered">
                    <div class="oneLine">
                        <div>
                            <div class="oneLine">

                                <div class="textBar rightCorner bordered" id="nameBar">
                                    <div class="icon">
                                        <img src="../img/icon/name.svg" height="25" width="25" />
                                    </div>
                                    <div class="input name">
                                        <input type='text' name='Nome' placeholder="Name" <?php if (!empty($userinfo["Nome"])) {
                                                                                                echo "value=" . $userinfo["Nome"];
                                                                                            } ?>>
                                    </div>
                                </div>
                                <div class="textBar rightCorner bordered" id="surnameBar">
                                    <div class="icon">
                                        <img src="../img/icon/name.svg" height="25" width="25" />
                                    </div>
                                    <div class="input surname">
                                        <input type='text' name='Cognome' placeholder="Surname" <?php if (!empty($userinfo["Cognome"])) {
                                                                                                    echo "value=" . $userinfo["Cognome"];
                                                                                                } ?>>
                                    </div>
                                </div>
                            </div>
                            <div class="textBar rightCorner bordered last" id="emailBar">
                                <div class="icon">
                                    <img src="../img/icon/arroba.svg" height="25" width="25" />
                                </div>
                                <div class="input email">
                                    <input type='text' name='Email' placeholder="Email" <?php if (!empty($userinfo["Email"])) {
                                                                                            echo "value=" . $userinfo["Email"];
                                                                                        } ?>>
                                </div>
                               
                            </div>
                            <span  id="emailError">Indirizzo email non valido</span>
                            <div class="textBar rightCorner bordered last" id="usernameBar">
                                <div class="icon">
                                    <img src="../img/icon/profile.svg" height="25" width="25" />
                                </div>
                                <div class="input username">
                                    <input type='text' name='Username' placeholder="Username" <?php if (!empty($userinfo["Username"])) {
                                                                                                    echo "value=" . $userinfo["Username"];
                                                                                                } ?>>
                                </div>
                            </div>
                            <span  id="usernameError">Nome utente non disponibile</span>
                        </div>
                        <div class="dropZone" id="profileImage">
                            <span class="dropZonePrompt <?php if (!empty($userinfo["Propic"])) echo "hidden" ?>">Drop file here or click to upload</span>
                            <input type="file" name="myFile" class="dropZoneInput" accept='.jpg, .jpeg, image/gif, image/png' id="uploadOriginal">
                            <div class="dropZoneThumb <?php if (empty($userinfo["Propic"])) echo "hidden" ?>" <?php if (!empty($userinfo["Propic"])) {
                                                                                                                    echo "style='background-image: url(" . $userinfo["Propic"] . ")'";
                                                                                                                } ?>> </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="New-project" class="page">
                <h1>New project</h1>
                <a class="submit" id="github">
                    <img src="../img/icon/github.svg" height="50" width="50" />
                    <p>...with GitHub</p>
                </a>
                                                                                                        
                <div class="allSpace centered">
                    <form class="allSpace oneLine centered"  method='post' enctype="multipart/form-data">
                        <div class="leftDiv">

                                <div class="textBar rightCorner bordered last" id="nameProjectBar">
                                    <div class="icon">
                                        <img src="../img/icon/layers.svg" height="25" width="25" />
                                    </div>
                                    <div class="input nameProject">
                                        <input type='text' name='NomeProgetto' placeholder="Name">
                                    </div>
                                </div>
                                <span  id="nameProjectError">Nome già utilizzato</span>
                                <div class="textArea rightCorner bordered last" id="descriprionProjectArea">
                                    <div class="icon">
                                        <img src="../img/icon/font.svg" height="25" width="25" />
                                    </div>
                                    <div class="input descriprion">
                                        <textarea type='text' name='Descrizione' placeholder="Description"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="dropZone">
                            <span class="dropZonePrompt">Drop file here or click to upload</span>
                            <input type="file" name="ImmagineProgetto" class="dropZoneInput" accept='.jpg, .jpeg, image/gif, image/png' id="uploadOriginal">

                            <div class="dropZoneThumb hidden" > </div>
                      
                             
                        </div>
                        <div class="submit">
                            <input type='submit' value="Add project" id="submit">
                        </div>
                    </form>
                    <div class="main cards hidden"></div>
                </div>


    </section>
    <footer>
        <h4>Developed by Giovanni Mirulla</br>1000026838</h4>
        <a href="https://github.com/giovannimirulla">
            <img src="../img/icon/github.svg" height="30" width="30" />
        </a>
        <a href="https://www.instagram.com/giovannimirulla">
            <img src="../img/icon/instagram.svg" height="30" width="30" />
        </a>
        <a href="https://www.linkedin.com/in/giovannimirulla">
            <img src="../img/icon/linkedin.svg" height="30" width="30" />
        </a>
    </footer>
</body>

</html>
<?php mysqli_close($conn); ?>