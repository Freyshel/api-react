import { useEffect, useState } from "react";
import "./Noticias.css";

function AppNoticias() {
    const [noticias, setNoticias] = useState([]);
    const [categoria, setCategoria] = useState("general");
    const [cargado, setCargado] = useState(false);
    const [error, setError] = useState("");
    const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;

    useEffect(() => {
        const obtenerNoticias = async () => {
            try {
                setCargado(true);
                setError("");
                const url = `https://gnews.io/api/v4/top-headlines?category=${categoria}&lang=es&country=pe&max=10&apikey=${API_KEY}`
                const respuesta = await fetch(url);
                const datos = await respuesta.json();
                if (!respuesta.ok) {

                    throw new Error("No se pudieron cargar las noticias");
                }
                setNoticias(datos.articles || []);
            }
            catch (err) {
                setError(err.message);
                setNoticias([])

            }
            finally {
                setCargado(false)
            }
        };

        obtenerNoticias();

    }, [categoria]);

    return (
        <div className="noticias">
            <h1 className="noticias_title">Últimas noticias</h1>
            <div className="noticias_nav">
                <button onClick={() => setCategoria("general")}>General</button>
                <button onClick={() => setCategoria("world")}>Del Mundo</button>
                <button onClick={() => setCategoria("sports")}>Deportes</button>
                <button onClick={() => setCategoria("technology")}>Tecnologia</button>
                <button onClick={() => setCategoria("science")}>Ciencias</button>
                <button onClick={() => setCategoria("business")}>Negocios</button>
                <button onClick={() => setCategoria("entertainment")}>Entrenimiento</button>
                <button onClick={() => setCategoria("health")}>Salud</button>
            </div>
            <div className="noticias_content">
                {cargado && <p className="charging"> cargando noticias</p>}
                {error && <p className="error">{error}</p>}
                {!cargado && !error && (
                    <div>
                        {noticias.map((noticia, i) => (
                            <div className="noticias_card" key={noticia.url || i}>
                                <img src={noticia.image || "https://placehold.co/600x400?text=Noticia"} alt={noticia.title} />

                                <div className="noticia_info">
                                    <small>{noticia.source?.name}</small>
                                    <h3>{noticia.title}</h3>
                                    <p>{noticia.description}</p>
                                    <a href={noticia.url} target="_blank" rel="noneferrer">Leer más</a>
                                </div>
                            </div>
                        ))}
                    </div>

                )}

            </div>
        </div>

    );
}
export default AppNoticias;