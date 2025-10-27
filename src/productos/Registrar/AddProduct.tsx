/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import "./AddProduct.css"; // Asegúrate de que esta ruta es correcta
import { MarcasService } from "../../services/marcasService";
import { ProductosService } from "../../services/productosService";
import { LineasService } from "../../services/lineasService";
import { ProveedoresService } from "../../services/proveedoresService";
import type { Marca } from "../../marcas/interfaces/marca.interface";
import type { CreateProductoDto } from "../interfaces/Create-producto.dto";
import type { Linea } from "../../lineas/interfaces/lineas-interface";
import type { Proveedor } from "../../proveedores/interfaces/proveedores-interface";
import { useNavigate } from "react-router-dom";

// Importar Modales
import AddMarcaModal from "./MarcaModal";
import AddLineaModal from "./LineaModal";
import AddProveedorModal from "./ProveedorModal";

// Imports para nuevas funcionalidades
import Select from "react-select";
import { BsTrash } from "react-icons/bs";
import { Button } from "react-bootstrap"; // Asumo que usas react-bootstrap para el botón 'Quitar'

// Interfaz para las opciones de react-select
interface SelectOption {
  value: number;
  label: string;
}

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    brand: "", // Sigue siendo string (del <select>)
    line: "", // Sigue siendo string (del <select>)
    code: "",
    stock: "",
    image: null as File | null,
  });

  // Listas de datos
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  // Estado para proveedores múltiples
  const [proveedoresSeleccionados, setProveedoresSeleccionados] = useState<
    SelectOption[]
  >([]);

  // Estados de carga
  const [loadingMarcas, setLoadingMarcas] = useState(true);
  const [loadingLineas, setLoadingLineas] = useState(false);
  const [loadingProveedores, setLoadingProveedores] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Estados de modales
  const [showMarcaModal, setShowMarcaModal] = useState(false);
  const [showLineaModal, setShowLineaModal] = useState(false);
  const [showProveedorModal, setShowProveedorModal] = useState(false);

  // --- Estados de Imagen (como en el modal) ---
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState(
    "Ningún archivo seleccionado"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carga inicial de Marcas y Proveedores
  useEffect(() => {
    const fetchMarcasYProveedores = async () => {
      try {
        const dataMarcas = await MarcasService.getMarcas();
        setMarcas(dataMarcas.marcas);
        // Cargar también los proveedores
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

  // Limpieza de URL de previsualización
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Manejador de Inputs (excepto imagen)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // La lógica de 'image' se movió a handleFileChange
    if (e.target.name === "image") return;

    if (e.target instanceof HTMLTextAreaElement) {
      const { name, value } = e.target;
      setProduct({ ...product, [name]: value });
      return;
    }

    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // --- Nuevos handlers para la imagen (del modal) ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProduct({ ...product, image: file });
      setImageFileName(file.name);

      // Revocar la URL anterior si existe
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      // Crear y setear la nueva URL de previsualización
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      // Si el usuario cancela, limpiar
      handleRemoveImage();
    }
  };

  const handleRemoveImage = () => {
    setProduct({ ...product, image: null });
    setImageFileName("Ningún archivo seleccionado");

    // Revocar y limpiar la URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);

    // Resetear el input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  // --------------------------------------------------------

  // Manejador de Selects (Marca y Linea)
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

  // Handler para el multi-select de proveedores
  const handleProveedoresChange = (
    selectedOptions: readonly SelectOption[] | null
  ) => {
    setProveedoresSeleccionados(selectedOptions ? [...selectedOptions] : []);
  };

  // --- Callbacks de Modales ---

  // (Tu lógica de recarga de marcas ya es correcta)
  const handleMarcaCreated = async (nuevaMarca: Marca) => {
    try {
      setLoadingMarcas(true);
      const dataMarcas = await MarcasService.getMarcas();
      setMarcas(dataMarcas.marcas);
      setProduct((prevProduct) => ({
        ...prevProduct,
        brand: nuevaMarca.nombre,
      }));
    } catch (error) {
      console.error("Error recargando marcas:", error);
      alert(
        "Marca creada, pero no se pudo recargar la lista. Por favor, selecciónela manualmente."
      );
    } finally {
      setLoadingMarcas(false);
    }
  };

  const handleLineaCreated = async (nuevaLinea: Linea) => {
    try {
      setLoadingLineas(true);
      const marcaSeleccionada = marcas.find(
        (m) => m.nombre === product.brand
      );
      if (marcaSeleccionada) {
        const dataLineas = await LineasService.getLineasPorMarca(
          marcaSeleccionada.id
        );
        setLineas(dataLineas.lineas);
      }
      setProduct((prevProduct) => ({
        ...prevProduct,
        line: nuevaLinea.nombre,
      }));
    } catch (error) {
      console.error("Error recargando líneas:", error);
      alert(
        "Línea creada, pero no se pudo recargar la lista. Por favor, selecciónela manualmente."
      );
    } finally {
      setLoadingLineas(false);
    }
  };

  // Actualizado para el multi-select
  const handleProveedorCreated = async (nuevoProveedor: Proveedor) => {
    try {
      setLoadingProveedores(true);
      const dataProv = await ProveedoresService.getProveedor();
      setProveedores(dataProv.proveedores); // Actualizar la lista completa

      // Buscar el proveedor recién creado en la lista actualizada
      const nuevoProv = dataProv.proveedores.find(
        (p) => p.nombre === nuevoProveedor.nombre
      );

      if (nuevoProv) {
        // Convertirlo a SelectOption
        const newProvOption: SelectOption = {
          value: nuevoProv.id,
          label: nuevoProv.nombre,
        };
        // Añadirlo a la lista de seleccionados (en vez de reemplazar)
        setProveedoresSeleccionados((prevSelected) => [
          ...prevSelected,
          newProvOption,
        ]);
      }
    } catch (error) {
      console.error("Error recargando proveedores:", error);
      alert(
        "Proveedor creado, pero no se pudo recargar la lista. Por favor, selecciónelo manualmente."
      );
    } finally {
      setLoadingProveedores(false);
    }
  };

  // Submit del Formulario
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

      // Validación de proveedores
      if (proveedoresSeleccionados.length === 0)
        throw new Error("Debe seleccionar al menos un proveedor.");

      // Validaciones
      if (!marcaSeleccionada)
        throw new Error("Debe seleccionar una marca válida.");
      if (!lineaSeleccionada)
        throw new Error("Debe seleccionar una linea válida.");
      if (!product.stock || Number(product.stock) < 0)
        throw new Error("Debe ingresar un stock válido (0 o más).");
      if (!product.price || Number(product.price) <= 0)
        throw new Error("Debe ingresar un precio válido (mayor a 0).");

      // Obtener IDs de proveedores
      const proveedoresId = proveedoresSeleccionados.map((opt) => opt.value);

      const nuevoProducto: CreateProductoDto = {
        nombre: product.name,
        descripcion: product.description,
        precio: Number(product.price),
        codigo: product.code,
        imagen: product.image, // El estado 'image' (File) es correcto
        marcaId: marcaSeleccionada.id,
        lineaId: lineaSeleccionada.id,
        stock: Number(product.stock),
        detalleProveedores: proveedoresId, // Enviar array de IDs
      };

      await ProductosService.crearProducto(nuevoProducto);
      alert("✅ Producto creado correctamente");
      navigate("/productos");
    } catch (error: any) {
      alert(`❌ Error al crear el producto: ${error.message}`);
      console.error(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const selectedMarcaId =
    marcas.find((m) => m.nombre === product.brand)?.id || null;

  // Opciones para el select de proveedores
  const allProveedoresOptions: SelectOption[] = proveedores.map((p) => ({
    value: p.id,
    label: p.nombre,
  }));

  return (
    <div className="add-product-page">
      {/* Estilos del modal añadidos aquí (puedes moverlos a AddProduct.css) */}
      <style>{`
        .file-input-hidden { display: none; }
        .logo-preview-container {
          width: 150px;
          height: 150px;
          border: 2px dashed #ccc;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          background-color: #f8f9fa;
          margin: 0 auto; /* Centrar el contenedor */
        }
        .logo-preview-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .logo-placeholder {
          color: #6c757d;
          font-style: italic;
          text-align: center;
          padding: 10px;
        }
        .file-input-filename {
          font-size: 0.875rem;
          color: #6c757d;
          margin-top: 5px;
          word-break: break-all;
          display: block; /* Asegurar que esté en su propia línea */
        }
        .image-upload-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 10px;
          border-radius: 8px;
        }
        /* Estilos para el botón de quitar (si no usas Bootstrap) */
        .btn-outline-danger {
          color: #dc3545;
          border-color: #dc3545;
          background-color: transparent;
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          border-radius: 0.2rem;
          cursor: pointer;
        }
        .btn-outline-danger:hover {
          color: #fff;
          background-color: #dc3545;
          border-color: #dc3545;
        }
      `}</style>

      <main className="form-container">
        <h1>AGREGAR PRODUCTO</h1>

        <form className="product-form" onSubmit={handleSubmit}>
          {/* Nombre del producto */}
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

          {/* Descripción */}
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              placeholder="Escribe la descripción del producto"
              value={product.description}
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* Precio y Marca */}
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

          {/* Linea */}
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

          {/* --- CAMPO PROVEEDOR (react-select) --- */}
          <div className="form-group">
            <label>Proveedores</label>
            <Select
              id="proveedores"
              isMulti
              name="proveedores"
              options={allProveedoresOptions}
              classNamePrefix="select"
              placeholder="Selecciona uno o más proveedores..."
              value={proveedoresSeleccionados}
              onChange={handleProveedoresChange}
              isLoading={loadingProveedores}
              closeMenuOnSelect={false}
              noOptionsMessage={() => "No hay proveedores disponibles"}
              required // React-select no usa 'required', la validación se hace en handleSubmit
            />
            <button
              type="button"
              className="btn teal"
              onClick={() => setShowProveedorModal(true)}
            >
              NUEVO PROVEEDOR
            </button>
          </div>
          {/* ---------------------------------- */}

          {/* Código */}
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

          {/* Stock */}
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

          {/* --- Nueva sección de carga de imagen --- */}
          <div className="form-group image-upload-section">
            <label className="fw-bold mb-2">Foto</label>

            <div className="logo-preview-container mb-3">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Previsualización"
                  className="logo-preview-image"
                />
              ) : (
                <div className="logo-placeholder">Sin imagen seleccionada</div>
              )}
            </div>

            <input
              type="file"
              id="product-image-input" // ID único
              name="image"
              accept="image/*"
              className="file-input-hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={loadingSubmit}
            />

            <label htmlFor="product-image-input" className="btn teal mb-2">
              Agregar Imagen
            </label>

            <span className="file-input-filename mb-2">
              {imageFileName}
            </span>

            {/* Mostrar "Quitar" solo si hay una imagen cargada */}
            {product.image && (
              <Button // Botón de React-Bootstrap
                type="button"
                variant="outline-danger"
                size="sm"
                onClick={handleRemoveImage}
                disabled={loadingSubmit}
              >
                <BsTrash className="me-1" /> Quitar Imagen
              </Button>
            )}
          </div>
          {/* ----------------------------------------------- */}

          {/* Botón Guardar */}
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

      {/* --- RENDERIZADO DE TODOS LOS MODALES --- */}
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

      <AddProveedorModal
        show={showProveedorModal}
        onHide={() => setShowProveedorModal(false)}
        onProveedorCreated={handleProveedorCreated}
      />
    </div>
  );
};

export default AddProduct;