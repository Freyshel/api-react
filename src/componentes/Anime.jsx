import { useEffect, useState } from "react";
import "./Anime.css";

function AppAnime() {
    const [animes, setAnimes] = useState([]);
    const [categoria, setCategoria] = useState("sports"); 
    const [pagina, setPagina] = useState(1);
    const [cargado, setCargado] = useState(false);
    const [error, setError] = useState("");

    const categoriasDisponibles = [
        { id: "sports", nombre: "Deportes" },
        { id: "action", nombre: "Acción" },
        { id: "comedy", nombre: "Comedia" },
        { id: "romance", nombre: "Romance" },
        { id: "fantasy", nombre: "Fantasía" },
        { id: "scifi", nombre: "Ciencia Ficción" }
    ];

    const obtenerAnime = async (nuevaPagina = 1, acumular = false) => {
        try {
            setCargado(true);
            setError("");
            
            const url = `https://api.jikan.moe/v4/anime?q=${categoria}&sfw=true&page=${nuevaPagina}&limit=12`;
            const respuesta = await fetch(url);
            
            if (!respuesta.ok) throw new Error("Error al cargar los animes. Intenta de nuevo.");
            
            const datos = await respuesta.json();
            
            if (datos.data && datos.data.length > 0) {
                if (acumular) {
                    setAnimes(prev => [...prev, ...datos.data]);
                } else {
                    setAnimes(datos.data);
                }
                setPagina(nuevaPagina);
            } else if (!acumular) {
                throw new Error("No se encontraron animes para esta categoría.");
            }
        } catch (err) {
            setError(err.message);
            if (!acumular) setAnimes([]);
        } finally {
            setCargado(false);
        }
    };

    useEffect(() => {
        obtenerAnime(1, false);
    }, [categoria]);

    return (
        <div className="anime">
            <h1 className="anime_title">Explorador de Anime</h1>
            
            <div className="anime_nav">
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
            
            <div className="anime_content">
                {!cargado && !error && animes.length === 0 && (
                    <p className="charging">No hay animes para mostrar.</p>
                )}
                {error && <p className="error">{error}</p>}
                
                <div>
                    {animes.map((anime, index) => (
                        <a 
                            href={anime.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="anime_card" 
                            key={`${anime.mal_id}-${index}`}
                        >
                            <div className="anime-img-contenedor">
                                <img src={anime.images.jpg.large_image_url} alt={anime.title} />
                            </div>
                            <div className="anime-info">
                                <small>⭐ {anime.score || "N/A"}</small>
                                <h3>{anime.title}</h3>
                                <p>{anime.synopsis ? anime.synopsis : "Sin sinopsis disponible."}</p>
                                <span className="leer-mas-btn">Ver en MyAnimeList</span>
                            </div>
                        </a>
                    ))}
                </div>

                {cargado && <p className="charging">Cargando animes...</p>}

                {animes.length > 0 && !error && (
                    <div className="cargar-mas-contenedor">
                        <button 
                            className="cargar-mas-btn" 
                            onClick={() => obtenerAnime(pagina + 1, true)}
                            disabled={cargado}
                        >
                            {cargado ? "Cargando..." : "Cargar más animes"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppAnime;