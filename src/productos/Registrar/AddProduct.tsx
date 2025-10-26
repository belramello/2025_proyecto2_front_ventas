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
import { useNavigate } from "react-router-dom";

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
        newProduct.line = "";
      }
      return newProduct;
    });
  };

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

      // --- CORRECCIÓN DEL DTO ---
      // Tu 'productosService.tsx' espera 'marca', 'linea', y 'proveedor'
      // para luego renombrarlos a 'marcaId', 'lineaId', 'proveedorId'.
      const nuevoProducto: CreateProductoDto = {
        nombre: product.name,
        descripcion: product.description,
        precio: Number(product.price),
        codigo: product.code,
        imagen: product.image,
        marcaId: marcaSeleccionada.id, // <-- CORREGIDO (antes 'marcaId')
        lineaId: lineaSeleccionada.id, // <-- CORREGIDO (antes 'lineaId')
        stock: Number(product.stock),
      };
      // --- FIN CORRECCIÓN DTO ---

      const result = await ProductosService.crearProducto(nuevoProducto);
      alert("✅ Producto creado correctamente");
      console.log("Producto creado:", result);
      navigate("/productos");

      setProduct({
        name: "",
        description: "",
        price: "",
        brand: "",
        line: "",
        provider: "",
        code: "",
        stock: "",
        image: null,
      });
      setLineas([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) { // <-- CAMBIO A 'any'
      alert("❌ Error al crear el producto");

      // --- MEJOR LOGGING PARA VER EL ERROR ---
      if (error.response) {
        // El backend respondió con un error (400, 404, 500)
        console.error("Respuesta del servidor (error):", error.response.data);
        console.error("Estado HTTP:", error.response.status);
        // Muestra los mensajes de validación de NestJS
        if (error.response.data && error.response.data.message) {
          console.log("Detalles del error:", error.response.data.message);
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        console.error("No se recibió respuesta del servidor:", error.request);
      } else {
        // Error al configurar la petición
        console.error("Error al configurar la petición:", error.message);
      }
      // --- FIN MEJOR LOGGING ---

    } finally {
      setLoadingSubmit(false);
    }
  };

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
              required // Añadir validación HTML
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
            <button type="button" className="btn teal">
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