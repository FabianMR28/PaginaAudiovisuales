
document.addEventListener("DOMContentLoaded", () => {
    const marcaFiltro = document.getElementById("marcaFiltro");
    const ordenFiltro = document.getElementById("ordenFiltro");
    const buscador = document.getElementById("buscador");
    const contenedor = document.querySelector(".container");

    function filtrarYOrdenar() {
        const marca = marcaFiltro.value.toLowerCase();
        const texto = buscador.value.toLowerCase();
        const orden = ordenFiltro.value;

        let productos = Array.from(contenedor.querySelectorAll(".product"));

        // Filtrar
        productos.forEach(producto => {
            const titulo = producto.querySelector("h3").textContent.toLowerCase();
            const marcaProducto = producto.dataset.marca?.toLowerCase() || "";

            const coincideMarca = !marca || marcaProducto.includes(marca);
            const coincideBusqueda = !texto || titulo.includes(texto);

            producto.style.display = (coincideMarca && coincideBusqueda) ? "block" : "none";
        });

        // Ordenar
        if (orden) {
            productos.sort((a, b) => {
                const precioA = parseFloat(a.querySelector(".price").textContent.replace("S/.", "").trim());
                const precioB = parseFloat(b.querySelector(".price").textContent.replace("S/.", "").trim());
                return orden === "precio-asc" ? precioA - precioB : precioB - precioA;
            });

            // Limpiar y volver a insertar ordenados
            productos.forEach(p => contenedor.appendChild(p));
        }
    }

    marcaFiltro.addEventListener("change", filtrarYOrdenar);
    ordenFiltro.addEventListener("change", filtrarYOrdenar);
    buscador.addEventListener("input", filtrarYOrdenar);
});
