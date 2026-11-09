import "./Navbar.css";
function AppNavBar({ seccion, cambiarSeccion }) {

  const opciones = ["Inicio", "Noticias", "Perros","Musica","Obras","Anime","Personajes","Computadoras"];

  return (
    <nav className="navbar">

      <div className="logo">
        <span>📦</span> APIS
      </div>

      <div className="nav-links">
        {opciones.map((opcion) => (
          <button
            key={opcion}
            className={
              seccion === opcion ? "seleccionado" : ""
            }
            onClick={() => cambiarSeccion(opcion)}
          >
            {opcion}
          </button>
        ))}
      </div>

    </nav>
  );
}

export default AppNavBar;