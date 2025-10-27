import React, { useState, useEffect } from "react";
import "./AddProduct.css"; // Asegúrate de que esta ruta es correcta
import { MarcasService } from "../../services/marcasService";
import { ProductosService } from "../../services/productosService";
import type { Marca } from "../../marcas/interfaces/marca.interface";
import type { CreateProductoDto } from "../interfaces/Create-producto.dto";
import type { Linea } from "../../lineas/interfaces/lineas-interface"; // <-- Importar Linea
import type { Proveedor } from "../../proveedores/interfaces/proveedores-interface";
import { LineasService } from "../../services/lineasService";
import { ProveedoresService } from "../../services/proveedoresService";
import { useNavigate } from "react-router-dom";

// Importar Modales
import AddMarcaModal from "./MarcaModal"; // Ajusta esta ruta
import AddLineaModal from "./LineaModal";

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    brand: "", // Guarda el 'nombre' de la marca
    line: "", // Guarda el 'nombre' de la línea
    provider: "", // Guarda el 'nombre' del proveedor
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

  // Estado para controlar los modales
  const [showMarcaModal, setShowMarcaModal] = useState(false);
  const [showLineaModal, setShowLineaModal] = useState(false); // <-- NUEVO

  // Carga inicial de Marcas y Proveedores
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

  // Carga de Líneas cuando cambia la Marca seleccionada
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
        setLineas([]);
      } finally {
        setLoadingLineas(false);
      }
    };

    if (marcas.length > 0) {
      fetchLineasPorMarca();
    }
  }, [product.brand, marcas]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target instanceof HTMLInputElement) {
      const { name, value, files } = e.target;
      setProduct({
        ...product,
        [name]: files ? files[0] : value,
      });
    } else if (e.target instanceof HTMLTextAreaElement) {
      const { name, value } = e.target;
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => {
      const newProduct = { ...prevProduct, [name]: value };
      if (name === "brand") {
        newProduct.line = ""; // Resetea la línea si cambia la marca
      }
      return newProduct;
    });
  };

  // Callback cuando se CREA una MARCA en el modal
  const handleMarcaCreated = (nuevaMarca: Marca) => {
    setMarcas((prevMarcas) => [...prevMarcas, nuevaMarca]);
    setProduct((prevProduct) => ({
      ...prevProduct,
      brand: nuevaMarca.nombre, // Auto-seleccionar
    }));
  };

  // <-- NUEVO: Callback cuando se CREA una LÍNEA en el modal
  const handleLineaCreated = (nuevaLinea: Linea) => {
    setLineas((prevLineas) => [...prevLineas, nuevaLinea]);
    setProduct((prevProduct) => ({
      ...prevProduct,
      line: nuevaLinea.nombre, // Auto-seleccionar
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      // Encontrar los IDs basados en los 'nombres' seleccionados
      const marcaSeleccionada = marcas.find(
        (m) => m.nombre === product.brand
      );
      const lineaSeleccionada = lineas.find(
        (l) => l.nombre === product.line
      );
      const proveedorSeleccionado = proveedores.find(
        (p) => p.nombre === product.provider
      );

      // --- VALIDACIONES ---
      if (!marcaSeleccionada) {
        alert("Debe seleccionar una marca válida.");
        setLoadingSubmit(false);
        return;
      }
      if (!lineaSeleccionada) {
        alert("Debe seleccionar una linea válida.");
        setLoadingSubmit(false);
        return;
      }
      if (!proveedorSeleccionado) {
        alert("Debe seleccionar un proveedor válido.");
        setLoadingSubmit(false);
        return;
      }
      if (
        !product.stock ||
        product.stock === "" ||
        Number(product.stock) < 0
      ) {
        alert("Debe ingresar un stock válido (0 o más).");
        setLoadingSubmit(false);
        return;
      }
      if (
        !product.price ||
        product.price === "" ||
        Number(product.price) <= 0
      ) {
        alert("Debe ingresar un precio válido (mayor a 0).");
        setLoadingSubmit(false);
        return;
      }
      // --- FIN VALIDACIONES ---

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
      navigate("/productos"); // Redirige a la lista de productos
    } catch (error: any) {
      alert("❌ Error al crear el producto");
      if (error.response) {
        console.error("Respuesta del servidor (error):", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  // --- NUEVO: Obtenemos el ID de la marca seleccionada para pasarlo al modal ---
  const selectedMarca = marcas.find((m) => m.nombre === product.brand);
  const selectedMarcaId = selectedMarca ? selectedMarca.id : null;
  // -------------------------------------------------------------------------

  return (
    <div className="add-product-page">
      <main className="form-container">
        <h1>AGREGAR PRODUCTO</h1>

        <form className="product-form" onSubmit={handleSubmit}>
          {/* ... (Campos Nombre, Descripción, Precio) ... */}
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
                onClick={() => setShowMarcaModal(true)} // Abre modal de marca
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
              disabled={!product.brand || loadingLineas} // Deshabilitado si no hay marca
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
            {/* --- BOTÓN LÍNEA MODIFICADO --- */}
            <button
              type="button"
              className="btn teal"
              onClick={() => setShowLineaModal(true)} // Abre modal de línea
              disabled={!product.brand} // Deshabilitado si no hay marca
            >
              NUEVA LINEA
            </button>
            {/* ------------------------------- */}
          </div>

          {/* ... (Campos Proveedor, Código, Stock, Foto) ... */}
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

          <div className="form-group">
            <label>Foto</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
            />
          </div>

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

      {/* --- RENDERIZADO DE MODALES --- */}
      <AddMarcaModal
        show={showMarcaModal}
        onHide={() => setShowMarcaModal(false)}
        onMarcaCreated={handleMarcaCreated}
      />

      <AddLineaModal
        show={showLineaModal}
        onHide={() => setShowLineaModal(false)}
        onLineaCreated={handleLineaCreated}
        marcaId={selectedMarcaId} // Pasamos el ID de la marca seleccionada
      />
      {/* ------------------------------- */}
    </div>
  );
};

export default AddProduct;