<?php
include("conexion.php");

$query = "SELECT * FROM productos";
$resultado = $conexion->query($query);

$productos = [];

if ($resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $productos[] = $fila;
    }
}

echo json_encode($productos);
$conexion->close();
?>