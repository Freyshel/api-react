import AppNavBar from "./componentes/Navbar";
import AppNoticias from "./componentes/Noticias";
import AppPerros from "./componentes/Perros";
import AppMusica from "./componentes/Musica";
import AppObras from "./componentes/Obras";
import AppAnime from "./componentes/Anime";
import AppPersonajes from "./componentes/Personajes";
import AppComputadoras from "./componentes/Computadoras"
import "./App.css";
import { useState } from "react";

function App() {
  const [seccion, setSeccion] = useState("Inicio");

  return (
    <div className="app">
      <AppNavBar seccion={seccion} cambiarSeccion={setSeccion} />
      <main className="contenido">

        {seccion === "Inicio" && (
          <div className="bienvenido">
            <h1>Bienvenido a la galeria de APIs</h1>
            <p>Aquí encontraras una diversidad de APIs gratuiros de diversos temas</p>
          </div>
        )}
        {seccion === "Noticias" && <AppNoticias />}
        {seccion === "Perros" && <AppPerros />}
        {seccion === "Musica" && <AppMusica/>}
        {seccion === "Obras" && <AppObras/>}
        {seccion === "Anime" && <AppAnime/>}
        {seccion === "Personajes" && <AppPersonajes/>}
        {seccion === "Computadoras" && <AppComputadoras/>}
        
      </main>
    </div>
  );
}
export default App;