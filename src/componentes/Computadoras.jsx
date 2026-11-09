import { useEffect, useState } from "react";
import "./Computadoras.css";

function AppComputadoras() {
    const [productos, setProductos] = useState([]);
    const [categoria, setCategoria] = useState("laptop+gamer");
    const [cargado, setCargado] = useState(false);
    const [error, setError] = useState("");
    const [offset, setOffset] = useState(0);

    const categoriasDisponibles = [
        { id: "laptop+gamer", nombre: "Laptops" },
        { id: "procesador+pc", nombre: "Procesadores" },
        { id: "tarjeta+de+video", nombre: "Tarjetas Gráficas" },
        { id: "placa+madre", nombre: "Placas Madre" },
        { id: "memoria+ram+pc", nombre: "Memoria RAM" },
        { id: "monitor+gamer", nombre: "Monitores" }
    ];

    const obtenerProductos = async (acumular = false) => {
        try {
            setCargado(true);
            setError("");
            
            const currentOffset = acumular ? offset + 12 : 0;
            
            const targetUrl = `https://api.mercadolibre.com/sites/MPE/search?q=${categoria}&limit=12&offset=${currentOffset}`;
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
            
            const respuesta = await fetch(proxyUrl);
            
            if (!respuesta.ok) {
                throw new Error("No se pudieron cargar los componentes.");
            }
            
            const datosProxy = await respuesta.json();
            const datos = JSON.parse(datosProxy.contents);
            
            if (datos.results && datos.results.length > 0) {
                if (acumular) {
                    setProductos(prev => [...prev, ...datos.results]);
                } else {
                    setProductos(datos.results);
                }
                setOffset(currentOffset);
            } else if (!acumular) {
                throw new Error("No se encontraron productos para esta búsqueda.");
            }
        } catch (err) {
            setError(err.message);
            if (!acumular) setProductos([]);
        } finally {
            setCargado(false);
        }
    };

    useEffect(() => {
        obtenerProductos(false);
    }, [categoria]);

    return (
        <div className="computadoras">
            <h1 className="computadoras_title">Hardware y Componentes</h1>
            
            <div className="computadoras_nav">
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
            
            <div className="computadoras_content">
                {!cargado && !error && productos.length === 0 && (
                    <p className="charging">No hay componentes para mostrar.</p>
                )}

                {error && <p className="error">{error}</p>}
                
                <div>
                    {productos.map((producto) => {
                        const imagenAltaCalidad = producto.thumbnail
                            .replace("http:", "https:")
                            .replace("-I.jpg", "-O.jpg");

                        return (
                            <a 
                                href={producto.permalink} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="computadoras_card" 
                                key={producto.id}
                            >
                                <div className="computadoras-img-contenedor">
                                    <img src={imagenAltaCalidad} alt={producto.title} />
                                </div>
                                <div className="computadoras-info">
                                    <small>{producto.condition === "new" ? "Nuevo" : "Usado"}</small>
                                    <h3>{producto.title}</h3>
                                    <p className="precio">
                                        {producto.currency_id} {producto.price.toLocaleString('es-PE')}
                                    </p>
                                    <span className="leer-mas-btn">Ver componente</span>
                                </div>
                            </a>
                        );
                    })}
                </div>

                {cargado && <p className="charging">Buscando stock...</p>}

                {productos.length > 0 && !error && (
                    <div className="cargar-mas-contenedor">
                        <button 
                            className="cargar-mas-btn" 
                            onClick={() => obtenerProductos(true)}
                            disabled={cargado}
                        >
                            {cargado ? "Cargando..." : "Cargar más componentes"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppComputadoras;