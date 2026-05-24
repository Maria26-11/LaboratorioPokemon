<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 1);
error_reporting(E_ALL);
require 'libs/configuration.php';
require_once 'model/PokemonModel.php';

$model = new PokemonModel();
$metodo = $_SERVER['REQUEST_METHOD'];

$nombreParam = isset($_GET['nombre']) ? $_GET['nombre'] : null;
$idParam = isset($_GET['id']) ? $_GET['id'] : null;

switch ($metodo) {

    case 'GET':
        if ($nombreParam) {
            echo json_encode($model->buscarPorNombre($nombreParam));
        } else {
            echo json_encode($model->listar());
        }
        break;

    case 'POST':
        $datos = json_decode(file_get_contents("php://input"), true);

        if (
            isset($datos['nombre']) &&
            isset($datos['tipo']) &&
            isset($datos['fuerza']) &&
            isset($datos['altura']) &&
            isset($datos['peso'])
        ) {
            $model->insertar(
                $datos['nombre'],
                $datos['tipo'],
                $datos['fuerza'],
                $datos['altura'],
                $datos['peso']
            );

            http_response_code(201);
            echo json_encode(["mensaje" => "Pokémon guardado correctamente"]);
        } else {
            http_response_code(400);
            echo json_encode(["mensaje" => "Datos incompletos"]);
        }
        break;

    case 'PUT':
        $datos = json_decode(file_get_contents("php://input"), true);

        if (
            isset($datos['id_pokemon']) &&
            isset($datos['nombre']) &&
            isset($datos['tipo']) &&
            isset($datos['fuerza']) &&
            isset($datos['altura']) &&
            isset($datos['peso'])
        ) {
            $model->actualizar(
                $datos['id_pokemon'],
                $datos['nombre'],
                $datos['tipo'],
                $datos['fuerza'],
                $datos['altura'],
                $datos['peso']
            );

            echo json_encode(["mensaje" => "Pokémon actualizado correctamente"]);
        } else {
            http_response_code(400);
            echo json_encode(["mensaje" => "Datos incompletos para actualizar"]);
        }
        break;

    case 'DELETE':
        if ($idParam) {
            $model->eliminar($idParam);
            echo json_encode(["mensaje" => "Pokémon eliminado correctamente"]);
        } else {
            http_response_code(400);
            echo json_encode(["mensaje" => "Debe enviar el id del Pokémon"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["mensaje" => "Método no permitido"]);
        break;
}
?>