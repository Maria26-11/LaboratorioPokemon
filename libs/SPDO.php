<?php

require_once 'Config.php';

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of SPDO
 *
 * @author Nelson
 */
class SPDO extends PDO{
    
    private static $instance=null;
    
    public function __construct() {
       $config= Config::singleton();
       parent::__construct('mysql:host='.$config->get('dbhost').';dbname='.$config->get('dbname'),
               $config->get('dbuser'), $config->get('dbpass'));
    } // constructor
    
    public static function singleton(){
        if(self::$instance==null){
            self::$instance=new self();
        }
        return self::$instance;
    } // singleton
    
} // fin clase

?>
