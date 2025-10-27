/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import "./AddProduct.css";
import { MarcasService } from "../../services/marcasService";
import { ProductosService } from "../../services/productosService";
import { LineasService } from "../../services/lineasService";
import { ProveedoresService } from "../../services/proveedoresService";
import type { Marca } from "../../marcas/interfaces/marca.interface";
import type { CreateProductoDto } from "../interfaces/Create-producto.dto";
import type { Linea } from "../../lineas/interfaces/lineas-interface";
import type { Proveedor } from "../../proveedores/interfaces/proveedores-interface";
import { useNavigate } from "react-router-dom";

import AddMarcaModal from "./MarcaModal";
import AddLineaModal from "./LineaModal";
import AddProveedorModal from "./ProveedorModal";

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
  const [codigosProveedores, setCodigosProveedores] = useState<
    Record<number, string>
  >({});

  const [loadingMarcas, setLoadingMarcas] = useState(true);
  const [loadingLineas, setLoadingLineas] = useState(false);
  const [loadingProveedores, setLoadingProveedores] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [showMarcaModal, setShowMarcaModal] = useState(false);
  const [showLineaModal, setShowLineaModal] = useState(false);
  const [showProveedorModal, setShowProveedorModal] = useState(false); // <-- NUEVO

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target instanceof HTMLTextAreaElement) {
      const { name, value } = e.target;
      setProduct({ ...product, [name]: value });
      return;
    }

    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files && files[0] ? files[0] : null;
      setProduct({ ...product, image: file });
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (file) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleCodigoProveedorChange = (proveedorId: number, value: string) => {
    setCodigosProveedores((prev) => ({
      ...prev,
      [proveedorId]: value,
    }));
  };

  // Manejador de Selects
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

  const handleMarcaCreated = async (nuevaMarca: Marca) => {
    try {
      setLoadingMarcas(true);
      const dataMarcas = await MarcasService.getMarcas();
      setMarcas(dataMarcas.marcas);

      // Auto-seleccionar la marca nueva y reiniciar línea
      setProduct((prevProduct) => ({
        ...prevProduct,
        brand: nuevaMarca.nombre,
        line: "",
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
      const marcaSeleccionada = marcas.find((m) => m.nombre === product.brand);
      if (marcaSeleccionada) {
        const dataLineas = await LineasService.getLineasPorMarca(
          marcaSeleccionada.id
        );
        setLineas(dataLineas.lineas);
      }

      // Auto-seleccionar la línea nueva
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
  const handleProveedorCreated = async (nuevoProveedor: Proveedor) => {
    try {
      setLoadingProveedores(true); // Poner "Cargando..." en el select
      const dataProv = await ProveedoresService.getProveedor(); // Volver a pedirlos
      setProveedores(dataProv.proveedores); // Actualizar la lista

      // Auto-seleccionar el proveedor nuevo
      setProduct((prev) => ({
        ...prev,
        provider: nuevoProveedor.nombre,
      }));
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
      const marcaSeleccionada = marcas.find((m) => m.nombre === product.brand);
      const lineaSeleccionada = lineas.find((l) => l.nombre === product.line);

      // Validaciones
      if (!marcaSeleccionada)
        throw new Error("Debe seleccionar una marca válida.");
      if (!lineaSeleccionada)
        throw new Error("Debe seleccionar una linea válida.");
      if (!lineaSeleccionada)
        throw new Error("Debe seleccionar una línea válida.");
      if (Object.values(codigosProveedores).every((codigo) => !codigo.trim()))
        throw new Error(
          "Debe ingresar al menos un código de proveedor para el producto."
        );
      if (!product.stock || Number(product.stock) < 0)
        throw new Error("Debe ingresar un stock válido (0 o más).");
      if (!product.price || Number(product.price) <= 0)
        throw new Error("Debe ingresar un precio válido (mayor a 0).");

      const detalleProveedores = Object.entries(codigosProveedores)
       .filter(([_, codigo]) => codigo.trim() !== "")
        .map(([id, codigo]) => ({
          proveedorId: Number(id),
          codigo: codigo.trim(),
        }));

      const nuevoProducto: CreateProductoDto = {
        nombre: product.name,
        descripcion: product.description,
        precio: Number(product.price),
        codigo: product.code,
        imagen: product.image,
        marcaId: marcaSeleccionada.id,
        lineaId: lineaSeleccionada.id,
        stock: Number(product.stock),
        detalleProveedores,
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

  return (
    <div className="add-product-page">
      <main className="form-container">
        <h1>AGREGAR PRODUCTO</h1>

        <form className="product-form" onSubmit={handleSubmit}>
          {/* ... (Nombre, Descripción) ... */}
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
            <label>Código del producto</label>
            <input
              type="text"
              name="code"
              placeholder="Escribe el código del producto"
              value={product.code}
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

          {/* ... (Precio, Marca) ... */}
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

          {/* ... (Linea) ... */}
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

          {/* --- TABLA DE PROVEEDORES Y CÓDIGOS --- */}
          <div className="form-group">
            <label>Proveedores y códigos del producto</label>
            {loadingProveedores ? (
              <p>Cargando proveedores...</p>
            ) : proveedores.length === 0 ? (
              <p>No hay proveedores registrados.</p>
            ) : (
              <>
                <button
                  type="button"
                  className="btn teal"
                  onClick={() => setShowProveedorModal(true)}
                >
                  NUEVO PROVEEDOR
                </button>

                <table className="tabla-proveedores">
                  <thead>
                    <tr>
                      <th>Proveedor</th>
                      <th>Código del producto (según proveedor)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proveedores.map((prov) => (
                      <tr key={prov.id}>
                        <td>{prov.nombre}</td>
                        <td>
                          <input
                            type="text"
                            placeholder={`Código para ${prov.nombre}`}
                            value={codigosProveedores[prov.id] || ""}
                            onChange={(e) =>
                              handleCodigoProveedorChange(
                                prov.id,
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          {/* ... (Foto y Previsualización) ... */}
          <div className="form-group">
            <label>Foto</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
            />
          </div>
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
