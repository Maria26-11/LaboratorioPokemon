<?php
    require 'Config.php';
    $config= Config::singleton();
    
    $config->set('dbhost', 'localhost'); // ip
    $config->set('dbname', 'db_pokemon');
    $config->set('dbuser', 'root');
    $config->set('dbpass', '');
    
?>

