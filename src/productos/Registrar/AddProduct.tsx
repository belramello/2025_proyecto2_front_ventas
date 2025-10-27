import React, { useState, useEffect } from "react";
import "./AddProduct.css"; // Asegúrate de que esta ruta es correcta
import { MarcasService } from "../../services/marcasService";
import { ProductosService } from "../../services/productosService";
import type { Marca } from "../../marcas/interfaces/marca.interface";
import type { CreateProductoDto } from "../interfaces/Create-producto.dto";
import type { Linea } from "../../lineas/interfaces/lineas-interface";
import type { Proveedor } from "../../proveedores/interfaces/proveedores-interface";
import { LineasService } from "../../services/lineasService";
import { ProveedoresService } from "../../services/proveedoresService";
import { useNavigate } from "react-router-dom";

// Importar Modales
import AddMarcaModal from "./MarcaModal";
import AddLineaModal from "./LineaModal"; // Ajusta esta ruta

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    line: "",
    provider: "",
    code: "",
    stock: "",
    image: null as File | null,
  });

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  const [loadingMarcas, setLoadingMarcas] = useState(true);
  const [loadingLineas, setLoadingLineas] = useState(false);
  const [loadingProveedores, setLoadingProveedores] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Estados para modales
  const [showMarcaModal, setShowMarcaModal] = useState(false);
  const [showLineaModal, setShowLineaModal] = useState(false);

  // --- NUEVO (Paso 1): Estado para la URL de previsualización ---
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // -------------------------------------------------------------

  // Carga inicial
  useEffect(() => {
    const fetchMarcasYProveedores = async () => {
      try {
        const dataMarcas = await MarcasService.getMarcas();
        setMarcas(dataMarcas.marcas);
        const dataProv = await ProveedoresService.getProveedor();
        setProveedores(dataProv.proveedores);
      } catch (error) {
        console.error("Error al cargar marcas o proveedores:", error);
      } finally {
        setLoadingMarcas(false);
        setLoadingProveedores(false);
      }
    };
    fetchMarcasYProveedores();
  }, []);

  // Carga de Líneas
  useEffect(() => {
    const fetchLineasPorMarca = async () => {
      if (!product.brand) {
        setLineas([]);
        return;
      }
      setLoadingLineas(true);
      setLineas([]);
      try {
        const marcaSeleccionada = marcas.find(
          (m) => m.nombre === product.brand
        );
        if (marcaSeleccionada) {
          const dataLineas = await LineasService.getLineasPorMarca(
            marcaSeleccionada.id
          );
          setLineas(dataLineas.lineas);
        }
      } catch (error) {
        console.error("Error al cargar las líneas por marca:", error);
      } finally {
        setLoadingLineas(false);
      }
    };
    if (marcas.length > 0) {
      fetchLineasPorMarca();
    }
  }, [product.brand, marcas]);

  // --- NUEVO (Paso 2): Efecto para limpiar la URL y evitar memory leaks ---
  // Esto es importante. URL.createObjectURL() reserva memoria.
  // Este efecto limpia la URL anterior cada vez que cambia o cuando el componente se desmonta.
  useEffect(() => {
    // Retorna una función de "limpieza"
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]); // Se ejecuta cada vez que previewUrl cambia
  // ---------------------------------------------------------------------

  // --- MODIFICADO (Paso 3): Manejador de inputs ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // --- Manejo de Textareas (descripción) ---
    if (e.target instanceof HTMLTextAreaElement) {
      const { name, value } = e.target;
      setProduct({ ...product, [name]: value });
      return;
    }

    // --- Manejo de Inputs (texto, número, archivo) ---
    const { name, value, files } = e.target;

    // Lógica específica para el input de la imagen
    if (name === "image") {
      const file = files && files[0] ? files[0] : null;

      // 1. Guardar el objeto File en el estado del producto
      setProduct({ ...product, image: file });

      // 2. Limpiar la preview anterior si existe
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // 3. Crear y guardar la nueva URL de previsualización
      if (file) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null); // Limpiar si el usuario cancela
      }
    } else {
      // Lógica para todos los demás inputs (name, price, stock, code)
      setProduct({ ...product, [name]: value });
    }
  };
  // --------------------------------------------------

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => {
      const newProduct = { ...prevProduct, [name]: value };
      if (name === "brand") {
        newProduct.line = "";
      }
      return newProduct;
    });
  };

  // Callbacks de los modales
  const handleMarcaCreated = (nuevaMarca: Marca) => {
    setMarcas((prevMarcas) => [...prevMarcas, nuevaMarca]);
    setProduct((prevProduct) => ({
      ...prevProduct,
      brand: nuevaMarca.nombre,
    }));
  };

  const handleLineaCreated = (nuevaLinea: Linea) => {
    setLineas((prevLineas) => [...prevLineas, nuevaLinea]);
    setProduct((prevProduct) => ({
      ...prevProduct,
      line: nuevaLinea.nombre,
    }));
  };

  // Submit del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const marcaSeleccionada = marcas.find(
        (m) => m.nombre === product.brand
      );
      const lineaSeleccionada = lineas.find(
        (l) => l.nombre === product.line
      );
      const proveedorSeleccionado = proveedores.find(
        (p) => p.nombre === product.provider
      );

      // Validaciones
      if (!marcaSeleccionada) throw new Error("Debe seleccionar una marca válida.");
      if (!lineaSeleccionada) throw new Error("Debe seleccionar una linea válida.");
      if (!proveedorSeleccionado) throw new Error("Debe seleccionar un proveedor válido.");
      if (Number(product.stock) < 0) throw new Error("El stock no puede ser negativo.");
      if (Number(product.price) <= 0) throw new Error("El precio debe ser mayor a 0.");

      const nuevoProducto: CreateProductoDto = {
        nombre: product.name,
        descripcion: product.description,
        precio: Number(product.price),
        codigo: product.code,
        imagen: product.image,
        marcaId: marcaSeleccionada.id,
        lineaId: lineaSeleccionada.id,
        stock: Number(product.stock),
      };

      await ProductosService.crearProducto(nuevoProducto);
      alert("✅ Producto creado correctamente");
      navigate("/productos");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(`❌ Error al crear el producto: ${error.message}`);
      console.error(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const selectedMarcaId = marcas.find(
    (m) => m.nombre === product.brand
  )?.id || null;

  return (
    <div className="add-product-page">
      <main className="form-container">
        <h1>AGREGAR PRODUCTO</h1>

        <form className="product-form" onSubmit={handleSubmit}>
          {/* ... (Campos Nombre, Descripción, Precio, Marca, Linea, Proveedor, Código, Stock) ... */}
          <div className="form-group">
            <label>Nombre del producto</label>
            <input
              type="text"
              name="name"
              placeholder="Escribe el nombre del producto"
              value={product.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              placeholder="Escribe la descripción del producto"
              value={product.description}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                name="price"
                placeholder="Escribe el precio del producto"
                value={product.price}
                onChange={handleInputChange}
                required
                min="0.01"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Marca</label>
              <select
                name="brand"
                value={product.brand}
                onChange={handleSelectChange}
                disabled={loadingMarcas}
                required
              >
                <option value="">
                  {loadingMarcas
                    ? "Cargando marcas..."
                    : "Selecciona una marca"}
                </option>
                {marcas.map((marca) => (
                  <option key={marca.id} value={marca.nombre}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn teal"
                onClick={() => setShowMarcaModal(true)}
              >
                NUEVA MARCA
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Linea</label>
            <select
              name="line"
              value={product.line}
              onChange={handleSelectChange}
              disabled={!product.brand || loadingLineas}
              required
            >
              <option value="">
                {loadingLineas
                  ? "Cargando líneas..."
                  : !product.brand
                  ? "Selecciona una marca primero"
                  : lineas.length === 0
                  ? "No hay líneas para esta marca"
                  : "Selecciona una línea"}
              </option>
              {lineas.map((linea) => (
                <option key={linea.id} value={linea.nombre}>
                  {linea.nombre}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn teal"
              onClick={() => setShowLineaModal(true)}
              disabled={!product.brand}
            >
              NUEVA LINEA
            </button>
          </div>

          <div className="form-group">
            <label>Proveedor</label>
            <select
              name="provider"
              value={product.provider}
              onChange={handleSelectChange}
              disabled={loadingProveedores}
              required
            >
              <option value="">
                {loadingProveedores
                  ? "Cargando proveedores..."
                  : "Selecciona un proveedor"}
              </option>
              {proveedores.map((prov) => (
                <option key={prov.id} value={prov.nombre}>
                  {prov.nombre}
                </option>
              ))}
            </select>
            <button type="button" className="btn teal">
              NUEVO PROVEEDOR
            </button>
          </div>

          <div className="form-group">
            <label>Código</label>
            <input
              type="text"
              name="code"
              placeholder="Ingresa el código vinculado al proveedor"
              value={product.code}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              placeholder="Ingresa el stock inicial"
              value={product.stock}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>

          {/* --- CAMPO DE IMAGEN Y PREVISUALIZACIÓN (Paso 4) --- */}
          <div className="form-group">
            <label>Foto</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
            />
          </div>

          {/* Mostrar la previsualización si existe la URL */}
          {previewUrl && (
            <div className="form-group image-preview-container">
              <label>Vista Previa:</label>
              <img
                src={previewUrl}
                alt="Vista previa"
                className="image-preview"
              />
            </div>
          )}
          {/* ---------------------------------------------------- */}

          <div className="form-actions">
            <button
              type="submit"
              className="btn green"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? "Guardando..." : "GUARDAR"}
            </button>
          </div>
        </form>
      </main>

      {/* Renderizado de Modales */}
      <AddMarcaModal
        show={showMarcaModal}
        onHide={() => setShowMarcaModal(false)}
        onMarcaCreated={handleMarcaCreated}
      />

      <AddLineaModal
        show={showLineaModal}
        onHide={() => setShowLineaModal(false)}
        onLineaCreated={handleLineaCreated}
        marcaId={selectedMarcaId}
      />
    </div>
  );
};

export default AddProduct;