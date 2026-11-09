import { useEffect, useState } from "react";
import "./Perros.css";

function AppPerros() {
    const [perros, setPerros] = useState([]);
    const [raza, setRaza] = useState("aleatorio");
    const [cargado, setCargado] = useState(false);
    const [error, setError] = useState("");

    const razasDisponibles = [
        { id: "aleatorio", nombre: "Aleatorio" },
        { id: "husky", nombre: "Husky" },
        { id: "pug", nombre: "Pug" },
        { id: "beagle", nombre: "Beagle" },
        { id: "labrador", nombre: "Labrador" },
        { id: "chihuahua", nombre: "Chihuahua" },
        { id: "bulldog", nombre: "Bulldog" }
    ];

    const extraerRaza = (url) => {
        try {
            const partes = url.split("/breeds/");
            if (partes.length > 1) {
                const razaEnCrudo = partes[1].split("/")[0];
                return razaEnCrudo.split("-").map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1)).join(" ");
            }
            return "Raza Desconocida";
        } catch (e) {
            return "Perrito";
        }
    };

    const obtenerPerros = async (acumular = false) => {
        try {
            setCargado(true);
            setError("");

            const url = raza === "aleatorio"
                ? "https://dog.ceo/api/breeds/image/random/12"
                : `https://dog.ceo/api/breed/${raza}/images/random/12`;

            const respuesta = await fetch(url);
            const datos = await respuesta.json();

            if (datos.status !== "success") {
                throw new Error("No se pudieron cargar las imágenes");
            }

            if (acumular) {
                setPerros(prevPerros => [...prevPerros, ...datos.message]);
            } else {
                setPerros(datos.message || []);
            }
        } catch (err) {
            setError(err.message);
            if (!acumular) setPerros([]);
        } finally {
            setCargado(false);
        }
    };

    useEffect(() => {
        obtenerPerros(false);
    }, [raza]);

    return (
        <div className="perros">
            <h1 className="perros_title">Galería de Perros</h1>

            <div className="perros_nav">
                {razasDisponibles.map((item) => (
                    <button
                        key={item.id}
                        className={raza === item.id ? "activo" : ""}
                        onClick={() => setRaza(item.id)}
                    >
                        {item.nombre}
                    </button>
                ))}
            </div>

            <div className="perros_content">
                {!cargado && !error && perros.length === 0 && (
                    <p className="charging">No hay perritos para mostrar.</p>
                )}

                {error && <p className="error">{error}</p>}

                <div>
                    {perros.map((imgUrl, i) => (
                        <div className="perros_card" key={`${imgUrl}-${i}`}>
                            <div className="perro-img-contenedor">
                                <img src={imgUrl} alt={`Perrito ${i + 1}`} />
                            </div>
                            <div className="perro-info">
                                <h3>{extraerRaza(imgUrl)}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {cargado && <p className="charging">Cargando perritos...</p>}

                {perros.length > 0 && !error && (
                    <div className="cargar-mas-contenedor">
                        <button
                            className="cargar-mas-btn"
                            onClick={() => obtenerPerros(true)}
                            disabled={cargado}
                        >
                            {cargado ? "Cargando..." : "Cargar más perritos"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppPerros;