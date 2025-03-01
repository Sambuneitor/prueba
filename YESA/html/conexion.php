<?php
$servidor = "localhost"; 
$usuario = "root@"; 
$clave = ""; 
$base_datos = "YESA";


$conexion = new mysqli($servidor, $usuario, $clave, $base_datos);


if ($conexion->connect_error) {
    die("Error en la conexión: " . $conexion->connect_error);
} 
?>
