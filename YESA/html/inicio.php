
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YESA - Pocillos y Alcancías</title>
    <link rel="stylesheet" href="../css/inicio.css">
</head>
<body>
    <header>
        <div class="logo">YESA</div>
        <div class="search-bar">
            <input class="input" placeholder="Buscar">
        </div>
        <nav>
            <a href="../html/isesion.html" class="nav-btn">Iniciar Sesión</a>
            <a href="../html/registro.html" class="nav-btn">Registrate</a>
            <button class="category-btn">Alcancias</button>
            <button class="category-btn">Pocillos</button>
            <button class="cart-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
            </button>
        </nav>
    </header>
    
    <main>
    <section class="offers-section">
    <div class="offers-banner">
        <h2>Ofertas</h2>
    </div>
    <div class="featured-products">
        <?php
        include("conexion.php");

        $query = "SELECT * FROM productos WHERE destacado = 1";
        $resultado = $conexion->query($query);

        if ($resultado->num_rows > 0) {
            while ($producto = $resultado->fetch_assoc()) {
                echo "<div class='product featured' data-id='".$producto['id']."'>
                            <img src='".$producto['imagen']."' alt='Producto destacado'>
                            <div class='product-info'>
                            <h3>".$producto['nombre']."</h3>
                            <button class='buy-btn' data-id='".$producto['id']."'>Comprar</button>
                        </div>
                    </div>";
            }
        } else {
            echo "<p>No hay productos destacados en este momento.</p>";
        }

        $conexion->close();
        ?>
    </div>
</section>

<section class="products-grid">
    <?php
    include("conexion.php");
    $query = "SELECT * FROM productos";
    $resultado = $conexion->query($query);

    if ($resultado->num_rows > 0) {
        while ($producto = $resultado->fetch_assoc()) {
            echo "<div class='product'>
                    <img src='".$producto['imagen']."' alt='".$producto['nombre']."'>
                    <h3>".$producto['nombre']."</h3>
                    <p>".$producto['descripcion']."</p>
                    <p class='price'>$".$producto['precio']."</p>
                    <button class='buy-btn' data-id='".$producto['id']."'>Comprar</button>
                </div>";
        }
    } else {
        echo "<p>No hay productos disponibles.</p>";
    }

    $conexion->close();
    ?>
</section>

    </main>

    <footer>
        <p>© 2025 YESA - Todos los derechos reservados</p>
    </footer>

    <script src="../js/inicio.js"></script>
</body>
</html>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">
