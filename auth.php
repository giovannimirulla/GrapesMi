<?php
    /********************************************************
       Controlla che l'utente sia già autenticato, per non 
       dover chiedere il login ad ogni volta               
    *********************************************************/
    require_once 'dbconfig.php';
    require_once 'githubConfig.php';
    require_once 'functions.php';

    session_start();

    function checkAuth() {
        // Se esiste già una sessione, la ritorno, altrimenti ritorno 0
        return session('_grapesmi_email',0);       

    }

?>