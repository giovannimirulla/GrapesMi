<!DOCTYPE html>
<html lang="it">
<?php
require_once '../auth.php';
$conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);
if ($userid = checkAuth()) {
    $userid = mysqli_real_escape_string($conn, $userid);
    $query = "SELECT * FROM ACCOUNT A JOIN ANAGRAFICA_ACCOUNT AA ON A.ID = AA.ID WHERE A.Email = '$userid'";
    $res_1 = mysqli_query($conn, $query);
    $userinfo = mysqli_fetch_assoc($res_1);
}
$search = trim(mysqli_real_escape_string($conn, $_GET['q']));
if (empty($search)) {
    header("Location: /hw1");
}
mysqli_close($conn);
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
    <script src="../js/getValue.js" defer="true"></script>
    <script src="../js/menu.js" defer="true"></script>
    <script src="js/script.js" defer="true"></script>
    <title>Search - Grapes Mi</title>
</head>

<body>
    <header class="small">
        <nav>
            <div class="navButtons">
                <a id="navLogo" href="/hw1">
                    <img src="../img/icon/logo.svg" height="50" width="50" />
                    <h2>Grapes Mi</h2>
                </a>
                <form class="textBar rightCorner bordered" id="searchProjectsBar">
                    <div class="input">
                        <input type="text" id="text" name="q" placeholder="Search..." <?php if (isset($_GET["q"])) {
                                                                                            echo "value=" . $search;
                                                                                        } ?>>
                    </div>
                    <button class="button" value="" id="searchButton" type="submit">
                        <img src="../img/icon/search.svg " height="25" width="25" />
                    </button>
                </form>
            </div>
            <div class="navButtons">
            <div id='profileButton' class="menuProfile <?php if (!$userid) {
                                                                echo "hidden";
                                                            } ?>">
                    <img class="propic  <?php if (empty($userinfo['Propic'])) echo "hidden" ?>" <?php if (!empty($userinfo['Propic'])) echo "src='" . $userinfo['Propic'] . "'" ?> class="<?php if (!isset($userinfo['Propic'])) echo "hidden" ?>"></img>
                    <p class="propic <?php if (!empty($userinfo['Propic'])) echo "hidden" ?>">
                        <?php if (empty($userinfo['Propic']))
                            if (!empty($userinfo['Nome'][0]) || !empty($userinfo['Cognome']))
                                echo strtoupper($userinfo['Nome'])[0] . strtoupper($userinfo['Cognome'])[0];
                            else echo strtoupper($userinfo['Username'])[0];
                        ?></p>
                    <p class='username <?php if (!$userid) {
                                            echo "hidden";
                                        } ?>'><?php if ($userid) echo "@" . $userinfo['Username']; ?> </p>
                    <div class="dropdown">
                        <div class="option centered"><a href='/hw1/profile'>Profile</a></div>
                        <div class="option centered" id="logout"><a href='/hw1/logout.php'>Logout</a></div>
                    </div>
                </div>


                <a href='../join?q=login' id='login' class="<?php if ($userid) {
                                                                echo "hidden";
                                                            } ?>">Login</a>
                <a href='../join?q=signup' class='highlined <?php if ($userid) {
                                                                echo "hidden";
                                                            } ?>'><b>Sign up</b></a>
            </div>
        </nav>
    </header>
    <section class="whiteSection large">
        <div class="search" id="notify">
            <h1>Wait a moment</h1>
            <p>I'm loading data for you...</p>
        </div>
        <div class="main cards" id="contents"></div>
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