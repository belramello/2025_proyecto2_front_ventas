import React, { useState, useEffect } from "react";
import "./AddProduct.css";
import { MarcasService } from "../../services/marcasService";
import { ProductosService } from "../../services/productosService";
import type { Marca } from "../../marcas/interfaces/marca.interface";
import type { CreateProductoDto } from "../interfaces/Create-producto.dto";
import type { Linea } from "../../lineas/interfaces/lineas-interface";
import type { Proveedor } from "../../proveedores/interfaces/proveedores-interface";
import { LineasService } from "../../services/lineasService";
import { ProveedoresService } from "../../services/proveedoresService";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    line: "",
    provider: "",
    code: "",
    image: null as File | null,
  });
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loadingLineas, setLoadingLineas] = useState(true);
  const [loadingProveedores, setLoadingProveedores] = useState(true);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loadingMarcas, setLoadingMarcas] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // === Cargar marcas al montar el componente ===
  useEffect(() => {
    const fetchMarcasLineasProveedores = async () => {
  try {
    const data = await MarcasService.getMarcas();
    setMarcas(data.marcas);
    const linea = await LineasService.getLineas();
    setLineas(linea.lineas);
    const prov = await ProveedoresService.getProveedor();
    setProveedores(prov.proveedores);
  } catch (error) {
    console.error("Error al cargar las marcas:", error);
  } finally {
    setLoadingMarcas(false);
    setLoadingLineas(false);
    setLoadingProveedores(false);
  }
};
    fetchMarcasLineasProveedores();

  }, []);

  // === Manejadores ===
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
    setProduct({
      ...product,
      [name]: value,
    });
  };

  // === Enviar formulario ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const marcaSeleccionada = marcas.find(
        (m) => m.nombre === product.brand
      );

      if (!marcaSeleccionada) {
        alert("Debe seleccionar una marca válida.");
        return;
      }

      const lineaSeleccionada = lineas.find(
        (m) => m.nombre === product.brand
      );

      if (!lineaSeleccionada) {
        alert("Debe seleccionar una linea válida.");
        return;
      }

      const proveedorSeleccionado = proveedores.find(
        (m) => m.nombre === product.provider
      );

      if (!proveedorSeleccionado) {
        alert("Debe seleccionar un proveedor válido.");
        return;
      }

      const nuevoProducto: CreateProductoDto = {
        nombre: product.name,
        descripcion: product.description,
        precio: Number(product.price),
        codigo: product.code,
        imagen: product.image,
        marca: marcaSeleccionada.id,
        linea: lineaSeleccionada.id,
      };

      const result = await ProductosService.crearProducto(nuevoProducto);
      alert("✅ Producto creado correctamente");
      console.log("Producto creado:", result);

      // Limpiar formulario
      setProduct({
        name: "",
        description: "",
        price: "",
        brand: "",
        line: "",
        provider: "",
        code: "",
        image: null,
      });
    } catch (error) {
      alert("❌ Error al crear el producto");
      console.error(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // === Render ===
  return (
    <div className="add-product-page">
      <main className="form-container">
        <h1>AGREGAR PRODUCTO</h1>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del producto</label>
            <input
              type="text"
              name="name"
              placeholder="Escribe el nombre del producto"
              value={product.name}
              onChange={handleInputChange}
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
              />
            </div>

            <div className="form-group">
              <label>Marca</label>
              <select
                name="brand"
                value={product.brand}
                onChange={handleSelectChange}
                disabled={loadingMarcas}
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
              <button type="button" className="btn teal">
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
                disabled={loadingLineas}
              >
                <option value="">
                  {loadingLineas
                    ? "Cargando lineas..."
                    : "Selecciona una linea"}
                </option>
                {lineas.map((linea) => (
                  <option key={linea.id} value={linea.nombre}>
                    {linea.nombre}
                  </option>
                ))}
              </select>
              <button type="button" className="btn teal">
                NUEVA LINEA
              </button>
            </div>

            <div className="form-group">
              <label>Foto</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
              />
              <button type="button" className="btn purple">
                AGREGAR IMAGEN
              </button>
            </div>


          <div className="form-group">
              <label>Proveedor</label>
              <select
                name="provider"
                value={product.brand}
                onChange={handleSelectChange}
                disabled={loadingProveedores}
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
                NUEVA MARCA
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
              />
            </div>

          <div className="form-actions">
            <button type="submit" className="btn green" disabled={loadingSubmit}>
              {loadingSubmit ? "Guardando..." : "GUARDAR"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddProduct;
