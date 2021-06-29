<?php
// Verifica che l'utente sia già loggato, in caso positivo va direttamente alla home
include '../auth.php';

$email = "";
$username = "";
$avatar = "";
$password = "";
$confirmPassword = "";
$allow = false;

if (checkAuth()) {
    header('Location: /hw1/profile');
    exit;
}

if (session('access_token')) {
    $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']) or die(mysqli_error($conn));

    $emails = apiRequest($apiURLBase . 'user/public_emails');
    $user = apiRequest($apiURLBase . 'user');
    foreach ($emails as $e) {
        if ($e["primary"]) {
            $email = $e["email"];
            break;
        }
    }

    $email = mysqli_real_escape_string($conn, $email);
    $username = mysqli_real_escape_string($conn, $user["login"]);
    $avatar = mysqli_real_escape_string($conn, $user["avatar_url"]);

    $query = "SELECT Email FROM ACCOUNT WHERE Email = '$email'";
    $res = mysqli_query($conn, $query);
    if (mysqli_num_rows($res) > 0) {
        $_SESSION["_grapesmi_username"] = $username;
        $_SESSION["_grapesmi_email"] = $email;
        mysqli_close($conn);
        header('Location: /hw1/profile');
        exit;
    }
}

if (!empty($_POST["username"])) $username = $_POST["username"];
if (!empty($_POST["password"])) $password = $_POST["password"];
if (!empty($_POST["email"])) $email = $_POST["email"];
if (!empty($_POST["confirmPassword"])) $confirmPassword = $_POST["confirmPassword"];
if (!empty($_POST["allow"])) $allow = $_POST["allow"];

if (!empty($_POST["username"]) && !empty($_POST["password"])) {
    // Verifica l'esistenza di dati POST
    if (!empty($_POST["username"]) && !empty($_POST["password"]) && !empty($_POST["email"]) && !empty($_POST["confirmPassword"]) && !empty($_POST["allow"])) {
        $email = $_POST["email"];
        $confirmPassword = $_POST["confirmPassword"];
        $allow = $_POST["allow"];

        $error = array();
        $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']) or die(mysqli_error($conn));


        # USERNAME
        // Controlla che l'username rispetti il pattern specificato
        if (!preg_match('/^[a-zA-Z0-9_]{1,15}$/', $username)) {
            $error[] = "Username non valido";
        } else {
            $username = mysqli_real_escape_string($conn, $username);
            // Cerco se l'username esiste già o se appartiene a una delle 3 parole chiave indicate
            $query = "SELECT Username FROM ACCOUNT WHERE Username = '$username'";
            $res = mysqli_query($conn, $query);
            if (mysqli_num_rows($res) > 0) {
                $error[] = "Username già utilizzato";
            }
        }
        # PASSWORD
        if (strlen($password) < 8) {
            $error[] = "Caratteri password insufficienti";
        }
        # CONFERMA PASSWORD
        if (strcmp($password, $confirmPassword) != 0) {
            $error[] = "Le password non coincidono";
        }
        # EMAIL
        if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            $error[] = "Email non valida";
        } else {
            $email = mysqli_real_escape_string($conn, strtolower($_POST['email']));
            $res = mysqli_query($conn, "SELECT Email FROM ACCOUNT WHERE Email = '$email'");
            if (mysqli_num_rows($res) > 0) {
                $error[] = "Email già utilizzata";
            }
        }

        # REGISTRAZIONE NEL DATABASE
        if (count($error) == 0) {
            $password = mysqli_real_escape_string($conn, $_POST['password']);
            $password = password_hash($password, PASSWORD_BCRYPT);

            $query = "call registraAccount('$email', '$username', '$password','$avatar' , NULL, NULL, NULL, 0)";
            echo $query;
            if (mysqli_query($conn, $query)) {
                $_SESSION["_grapesmi_username"] = $username;
                $_SESSION["_grapesmi_email"] = $email;
                mysqli_close($conn);
                header("Location: /");
                exit;
            } else {
                $error[] = "Errore di connessione al Database";
            }
        }

        mysqli_close($conn);
    } else {
        // Se username e password sono stati inviati
        // Connessione al DB
        $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']) or die(mysqli_error($conn));
        // Preparazione 
        $username = mysqli_real_escape_string($conn, $username);
        $password = mysqli_real_escape_string($conn, $password);
        // Permette l'accesso tramite email o username in modo intercambiabile
        $searchField = filter_var($username, FILTER_VALIDATE_EMAIL) ? "email" : "username";
        // ID e Username per sessione, password per controllo
        $query = "SELECT email, username, password FROM ACCOUNT WHERE $searchField = '$username'";
        // Esecuzione
        $res = mysqli_query($conn, $query) or die(mysqli_error($conn));
        if (mysqli_num_rows($res) > 0) {
            // Ritorna una sola riga, il che ci basta perché l'utente autenticato è solo uno
            $entry = mysqli_fetch_assoc($res);
            if (password_verify($_POST['password'], $entry['password'])) {

                // (La gestione della sessione con i cookie è stata 
                // eliminata, per non aggiungere confusione)

                // Imposto una sessione dell'utente
                $_SESSION["_grapesmi_username"] = $entry['username'];
                $_SESSION["_grapesmi_email"] = $entry['email'];
                header("Location: /hw1/profile");
                mysqli_free_result($res);
                mysqli_close($conn);
                exit;
            }else{
                $error = "Username e/o password errati.";
            }
        }
        else{
            $error = "Username e/o password errati.";
        }
    }
} else if (isset($_POST["username"]) || isset($_POST["password"])) {
    // Se solo uno dei due è impostato
    $error = "Inserisci username e password.";
}

// Start the login process by sending the user to Github's authorization page
if (get('action') == 'github') {
    // Generate a random hash and store in the session for security
    $_SESSION['state'] = hash('sha256', microtime(TRUE) . rand() . $_SERVER['REMOTE_ADDR']);
    unset($_SESSION['access_token']);

    $params = array(
        'client_id' => OAUTH2_CLIENT_ID,
        'redirect_uri' => 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['PHP_SELF'],
        'scope' => 'user, repo',
        'state' => $_SESSION['state']
    );

    // Redirect the user to Github's authorization page
    header('Location: ' . $authorizeURL . '?' . http_build_query($params));
    die();
}
// When Github redirects the user back here, there will be a "code" and "state" parameter in the query string
if (get('code')) {
    // Verify the state matches our stored state
    if (!get('state') || $_SESSION['state'] != get('state')) {
        header('Location: ' . $_SERVER['PHP_SELF']);
        die();
    }

    // Exchange the auth code for a token
    $token = apiRequest($tokenURL, array(
        'client_id' => OAUTH2_CLIENT_ID,
        'client_secret' => OAUTH2_CLIENT_SECRET,
        'redirect_uri' => 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['PHP_SELF'],
        'state' => $_SESSION['state'],
        'code' => get('code')
    ));
    $_SESSION['access_token'] = $token["access_token"];

    header('Location: ' . $_SERVER['PHP_SELF']);
}


?>


<!DOCTYPE html>
<html lang="it" class="no-js">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <link rel="stylesheet" href="../style.css">
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="../img/favicon.png">
    <script src='../js/getValue.js' defer></script>
    <script src='js/index.js' defer></script>
    <title>Login - Grapes Mi</title>
</head>

<body>

    <header>
        <nav>
            <a id="navLogo" href="/hw1">
                <img src="../img/icon/logo.svg" height="50" width="50" />
                <h2>Grapes Mi</h2>
            </a>
        </nav>
        <div class="login">
            <form name="login" class="card" method="post">
                <div class="title centered">
                    <h2>Log in to your account</h2>
                    <?php
                // Verifica la presenza di errori
                if (isset($error)) {
                    echo "<span id='postSpan' class='errorSpan'>$error</span>";
                }
                
            ?>
                </div>
    
                <div class="textBar rightCorner bordered" id="usernameBar">
                    <div class="icon">
                        <img src="../img/icon/profile.svg" height="25" width="25" />
                    </div>
                    <div class="input username">
                        <input type='text' name='username' placeholder="username" <?php if (isset($username)) {
                                                                                        echo "value=" . $username;
                                                                                    } ?>>
                    </div>
                </div>
                <span  id="usernameError">Nome utente non disponibile</span>
<br>
                <div class="textBar rightCorner bordered hidden" id="emailBar">
                    <div class="icon">
                        <img src="../img/icon/arroba.svg" height="25" width="25" />
                    </div>
                    <div class="input email">
                        <input type='email' name='email' placeholder="email" <?php if (isset($email)) {
                                                                                    echo "value=" . $email;
                                                                                } ?>>
                    </div>
                </div>
                <span  id="emailError">Indirizzo email non valido</span>

                <div class="textBar rightCorner bordered" id="passwordBar">
                    <div class="icon">
                        <img src="../img/icon/password.svg" height="25" width="25" />
                    </div>
                    <div class="input password">
                        <input type='password' name='password' placeholder="password" <?php if (isset($password)) {
                                                                                            echo "value=" . $password;
                                                                                        } ?>>
                    </div>
                </div>
                <span id="passwordError">Inserisci almeno 8 caratteri</span>

                <div class="textBar rightCorner bordered hidden" id="confirmPasswordBar">
                    <div class="icon">
                        <img src="../img/icon/confirmPassword.svg" height="25" width="25" />
                    </div>
                    <div class="input confirmPassword">
                        <input type='password' name='confirmPassword' placeholder="confirm password" <?php if (isset($confirmPassword)) {
                                                                                                            echo "value=" . $confirmPassword;
                                                                                                        } ?>>
                    </div>
                </div>
                <span id="confirmPasswordError">Le password non coincidono</span>

                <br>
                <div class="allow">
                    <input type='checkbox' name='allow' value="1" <?php if (isset($allow)) {
                                                                        echo $allow ? "checked" : "";
                                                                    } ?>>
                    <label for='allow'>Acconsento al furto dei dati personali</label>
                </div>

                <div class="oneLine">
                <div class="submit">
                    <input type='submit' value="Login" id="submit">
                </div>
                <a class="submit" id="github" href="?action=github">
                    <img src="../img/icon/github.svg" height="50" width="50" />
                    <p>...with GitHub</p>
                </a>
                </div>
                <br>
                <div class="bottom centered" id="switch">
                <p>Don't have an account? </p><a><b>Create!</b></a>
                </div>
            </form>
        </div>
    </header>
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