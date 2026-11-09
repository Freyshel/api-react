import { useEffect, useState } from "react";
import "./Obras.css";

function AppObras() {
    const [obras, setObras] = useState([]);
    const [categoria, setCategoria] = useState("fiction");
    const [cargado, setCargado] = useState(false);
    const [error, setError] = useState("");

    const categoriasDisponibles = [
        { id: "fiction", nombre: "Ficción" },
        { id: "history", nombre: "Historia" },
        { id: "fantasy", nombre: "Fantasía" },
        { id: "romance", nombre: "Romance" },
        { id: "horror", nombre: "Terror" },
        { id: "science", nombre: "Ciencia" }
    ];

    const obtenerObras = async (acumular = false) => {
        try {
            setCargado(true);
            setError("");

            const currentOffset = acumular ? obras.length : 0;

            const url = `https://openlibrary.org/subjects/${categoria}.json?limit=12&offset=${currentOffset}`;

            const respuesta = await fetch(url);
            const datos = await respuesta.json();

            if (datos.works && datos.works.length > 0) {
                if (acumular) {
                    setObras(prev => [...prev, ...datos.works]);
                } else {
                    setObras(datos.works);
                }
            } else if (!acumular) {
                throw new Error("No se encontraron obras para esta categoría.");
            }
        } catch (err) {
            setError("Error al cargar las obras. Revisa tu conexión a internet.");
            if (!acumular) setObras([]);
        } finally {
            setCargado(false);
        }
    };

    useEffect(() => {
        obtenerObras(false);
    }, [categoria]);

    return (
        <div className="obras">
            <h1 className="obras_title">Biblioteca Digital</h1>

            <div className="obras_nav">
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

            <div className="obras_content">
                {!cargado && !error && obras.length === 0 && (
                    <p className="charging">No hay obras para mostrar.</p>
                )}

                {error && <p className="error">{error}</p>}

                <div>
                    {obras.map((obra, index) => {
                        const imagenUrl = obra.cover_id
                            ? `https://covers.openlibrary.org/b/id/${obra.cover_id}-L.jpg`
                            : "https://placehold.co/400x600?text=Sin+Portada";

                        const autores = obra.authors ? obra.authors.map(a => a.name).join(", ") : "Autor desconocido";
                        const link = `https://openlibrary.org${obra.key}`;
                        const temas = obra.subject ? obra.subject.slice(0, 3).join(", ") : "Literatura y Ficción";

                        return (
                            <a
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="obras_card"
                                key={`${obra.key}-${index}`}
                            >
                                <div className="obras-img-contenedor">
                                    <img src={imagenUrl} alt={obra.title} />
                                </div>
                                <div className="obras-info">
                                    <small>{autores}</small>
                                    <h3>{obra.title}</h3>
                                    <p>Temas: {temas}.</p>
                                    <span className="leer-mas-btn">Ver Detalles</span>
                                </div>
                            </a>
                        );
                    })}
                </div>

                {cargado && <p className="charging">Cargando obras...</p>}

                {obras.length > 0 && !error && (
                    <div className="cargar-mas-contenedor">
                        <button
                            className="cargar-mas-btn"
                            onClick={() => obtenerObras(true)}
                            disabled={cargado}
                        >
                            {cargado ? "Cargando..." : "Cargar más obras"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppObras;