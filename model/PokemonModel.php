<?php

class PokemonModel {

    protected $db;

    public function __construct() {
        require_once 'libs/SPDO.php';
        $this->db = SPDO::singleton();
    }

    public function listar() {
        $consulta = $this->db->prepare('CALL sp_listar_pokemon()');
        $consulta->execute();
        $resultado = $consulta->fetchAll(PDO::FETCH_ASSOC);
        $consulta->closeCursor();
        return $resultado;
    }

    public function buscarPorNombre($nombre) {
        $consulta = $this->db->prepare('CALL sp_buscar_pokemon_nombre(?)');
        $consulta->execute([$nombre]);
        $resultado = $consulta->fetchAll(PDO::FETCH_ASSOC);
        $consulta->closeCursor();
        return $resultado;
    }

    public function insertar($nombre, $tipo, $fuerza, $altura, $peso) {
        $consulta = $this->db->prepare('CALL sp_insertar_pokemon(?, ?, ?, ?, ?)');
        $consulta->execute([$nombre, $tipo, $fuerza, $altura, $peso]);
        $consulta->closeCursor();
    }

    public function actualizar($id, $nombre, $tipo, $fuerza, $altura, $peso) {
        $consulta = $this->db->prepare('CALL sp_actualizar_pokemon(?, ?, ?, ?, ?, ?)');
        $consulta->execute([$id, $nombre, $tipo, $fuerza, $altura, $peso]);
        $consulta->closeCursor();
    }

    public function eliminar($id) {
        $consulta = $this->db->prepare('CALL sp_eliminar_pokemon(?)');
        $consulta->execute([$id]);
        $consulta->closeCursor();
    }
}
?>