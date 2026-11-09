import { useEffect, useState } from "react";
import "./Personajes.css";

function AppPersonajes() {
    const [personajes, setPersonajes] = useState([]);
    const [categoria, setCategoria] = useState("Human"); 
    const [pagina, setPagina] = useState(1);
    const [cargado, setCargado] = useState(false);
    const [error, setError] = useState("");

    const categoriasDisponibles = [
        { id: "Human", nombre: "Humanos" },
        { id: "Alien", nombre: "Alienígenas" },
        { id: "Robot", nombre: "Robots" },
        { id: "Animal", nombre: "Animales" },
        { id: "Mythological Creature", nombre: "Mitológicos" }
    ];

    const obtenerPersonajes = async (nuevaPagina = 1, acumular = false) => {
        try {
            setCargado(true);
            setError("");
            
            const url = `https://rickandmortyapi.com/api/character/?species=${categoria}&page=${nuevaPagina}`;
            const respuesta = await fetch(url);
            
            if (!respuesta.ok) throw new Error("No hay más personajes en esta categoría.");
            
            const datos = await respuesta.json();
            
            if (datos.results) {
                if (acumular) {
                    setPersonajes(prev => [...prev, ...datos.results]);
                } else {
                    setPersonajes(datos.results);
                }
                setPagina(nuevaPagina);
            }
        } catch (err) {
            setError(err.message);
            if (!acumular) setPersonajes([]);
        } finally {
            setCargado(false);
        }
    };

    useEffect(() => {
        obtenerPersonajes(1, false);
    }, [categoria]);

    return (
        <div className="personajes">
            <h1 className="personajes_title">Universo Rick & Morty</h1>
            
            <div className="personajes_nav">
                {categoriasDisponibles.map((item) => (
                    <button 
                        key={item.id}
                        className={categoria === item.id ? "activo" : ""}
                        onClick={() => setCategoria(item.id)}
                    >
                        {item.nombre}
                    </button>
                ))}
            </div>
            
            <div className="personajes_content">
                {!cargado && !error && personajes.length === 0 && (
                    <p className="charging">No hay personajes para mostrar.</p>
                )}
                {error && <p className="error">{error}</p>}
                
                <div>
                    {personajes.map((personaje) => (
                        <div className="personajes_card" key={personaje.id}>
                            <div className="personajes-img-contenedor">
                                <img src={personaje.image} alt={personaje.name} />
                            </div>
                            <div className="personajes-info">
                                <h3>{personaje.name}</h3>
                                <p><strong>Estado:</strong> {personaje.status === "Alive" ? "🟢 Vivo" : personaje.status === "Dead" ? "🔴 Muerto" : "⚪Desconocido"}</p>
                                <p><strong>Origen:</strong> {personaje.origin.name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {cargado && <p className="charging">Viajando entre dimensiones...</p>}

                {personajes.length > 0 && !error && (
                    <div className="cargar-mas-contenedor">
                        <button 
                            className="cargar-mas-btn" 
                            onClick={() => obtenerPersonajes(pagina + 1, true)}
                            disabled={cargado}
                        >
                            {cargado ? "Cargando..." : "Cargar más personajes"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppPersonajes;