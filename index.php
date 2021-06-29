<!DOCTYPE html>
<html lang="it">
<?php
require_once 'auth.php';
$conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);
if ($userid = checkAuth()) {
    // Carico le informazioni dell'utente loggato per visualizzarle nella sidebar (mobile)
    $userid = mysqli_real_escape_string($conn, $userid);
    $query = "SELECT * FROM ACCOUNT A JOIN ANAGRAFICA_ACCOUNT AA ON A.ID = AA.ID WHERE A.Email = '$userid'";
    $res_1 = mysqli_query($conn, $query);
    $userinfo = mysqli_fetch_assoc($res_1);
}
?>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="img/favicon.png">
    <script src="js/menu.js" defer="true"></script>
    <script src="js/index.js" defer="true"></script>
    <title>Home - Grapes Mi</title>
</head>

<body>

    <header>
        <nav>
            <div class="navButtons">
                <a id="navLogo" href="">
                    <img src="img/icon/logo.svg" height="50" width="50" />
                    <h2>Grapes Mi</h2>
                </a>
                <a href="#projects" id="login">Explore</a>
                <a href="#plans" id="login">Plans</a>
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


                <a href='join?q=login' id='login' class="<?php if ($userid) {
                                                                echo "hidden";
                                                            } ?>">Login</a>
                <a href='join?q=signup' class='highlined <?php if ($userid) {
                                                                echo "hidden";
                                                            } ?>'><b>Sign up</b></a>
            </div>

            </div>
            </div>
        </nav>
        <div id="init">
            <h1>Look for a </br>project...</h1>
            <p>Your device may already have an operating system with an IoT project</p>
            <form name='search' method='get' class="textBar rightCorner bordered" action="/hw1/search" id="searchContentsBar" enctype="multipart/form-data" autocomplete="off">
                <div class="input">
                    <input type="text" id="search" name="q" placeholder="Search...">
                </div>
                <button class="button" type="submit">
                    <img src="img/icon/search.svg " height="25" width="25" />
                </button>
            </form>
        </div>
    </header>

    <section class="whiteSection" id="projects">
        <div class="title">
            <h1>Projects you may already<br>have on your device:</h1>
        </div>
        <div class="main">
        </div>
    </section>
    <section class="blackSection oneLine" id="plans">
        <div class="title">
            <h1>Choose a plan that suits your needs</h1>
        </div>
        <div class="main plans">
            <div class="plan" id="starter">
                <div class="top">
                    <h1>STARTER</h1>
                </div>
                <div class="center">
                    <h2>Free</h2>
                    <p>For first <b>10</b> devices</p>
                </div>
                <div class="bottom">
                    <a href="join?q=login"><b>GET STARTED</b></a>
                </div>
            </div>
            <div class="plan highlined" id="pro">
                <div class="top">
                    <h1>PRO</h1>
                </div>
                <div class="center">
                    <h2>$29/month</h2>
                    <p>For first <b>20</b> devices</p>
                </div>
                <div class="bottom">
                    <a href="join?q=login"><b>GET STARTED</b></a>
                </div>
            </div>
            <div class="plan" id="enterprise">
                <div class="top">
                    <h1>ENTERPRISE</h1>
                </div>
                <div class="center">
                    <h2>$249/month</h2>
                    <p>For first <b>50</b> devices</p>
                </div>
                <div class="bottom">
                    <a href="join?q=login"><b>GET STARTED</b></a>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <h4>Developed by Giovanni Mirulla</br>1000026838</h4>
        <a href="https://github.com/giovannimirulla">
            <img src="img/icon/github.svg" height="30" width="30" />
        </a>
        <a href="https://www.instagram.com/giovannimirulla">
            <img src="img/icon/instagram.svg" height="30" width="30" />
        </a>
        <a href="https://www.linkedin.com/in/giovannimirulla">
            <img src="img/icon/linkedin.svg" height="30" width="30" />
        </a>
    </footer>

</body>

</html>
<?php mysqli_close($conn); ?>