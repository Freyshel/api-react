import { useEffect, useState } from "react";
import "./Musica.css";

function AppMusica() {
    const [canciones, setCanciones] = useState([]);
    const [genero, setGenero] = useState("pop");
    const [cargado, setCargado] = useState(false);
    const [error, setError] = useState("");

    const generosDisponibles = [
        { id: "pop", nombre: "Pop" },
        { id: "rock", nombre: "Rock" },
        { id: "reggaeton", nombre: "Reggaeton" },
        { id: "jazz", nombre: "Jazz" },
        { id: "electronic", nombre: "Electrónica" },
        { id: "classical", nombre: "Clásica" }
    ];

    const obtenerMusica = async (acumular = false) => {
        try {
            setCargado(true);
            setError("");
            
            const currentOffset = acumular ? canciones.length : 0;
            
            const url = `https://itunes.apple.com/search?term=${genero}&media=music&entity=song&limit=12&offset=${currentOffset}`;
            
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            
            if (datos.results && datos.results.length > 0) {
                if (acumular) {
                    setCanciones(prev => [...prev, ...datos.results]);
                } else {
                    setCanciones(datos.results);
                }
            } else if (!acumular) {
                throw new Error("No se encontraron canciones");
            }
        } catch (err) {
            setError("Error al cargar la música. Intenta más tarde.");
            if (!acumular) setCanciones([]);
        } finally {
            setCargado(false);
        }
    };

    useEffect(() => {
        obtenerMusica(false);
    }, [genero]);

    return (
        <div className="musica">
            <h1 className="musica_title">Descubre Música</h1>
            
            <div className="musica_nav">
                {generosDisponibles.map((item) => (
                    <button 
                        key={item.id}
                        className={genero === item.id ? "activo" : ""}
                        onClick={() => setGenero(item.id)}
                    >
                        {item.nombre}
                    </button>
                ))}
            </div>
            
            <div className="musica_content">
                {!cargado && !error && canciones.length === 0 && (
                    <p className="charging">No hay canciones para mostrar.</p>
                )}

                {error && <p className="error">{error}</p>}
                
                <div>
                    {canciones.map((cancion, index) => (
                        <div className="musica_card" key={`${cancion.trackId}-${index}`}>
                            <div className="musica-img-contenedor">
                                <img 
                                    src={cancion.artworkUrl100.replace('100x100bb', '300x300bb')} 
                                    alt={cancion.trackName} 
                                />
                            </div>
                            <div className="musica-info">
                                <h3>{cancion.trackName}</h3>
                                <small>{cancion.artistName}</small>
                                
                                {cancion.previewUrl ? (
                                    <audio controls className="reproductor">
                                        <source src={cancion.previewUrl} type="audio/mp4" />
                                    </audio>
                                ) : (
                                    <p className="no-audio">Sin vista previa</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {cargado && <p className="charging">Cargando canciones...</p>}

                {canciones.length > 0 && !error && (
                    <div className="cargar-mas-contenedor">
                        <button 
                            className="cargar-mas-btn" 
                            onClick={() => obtenerMusica(true)}
                            disabled={cargado}
                        >
                            {cargado ? "Cargando..." : "Cargar más canciones"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppMusica;