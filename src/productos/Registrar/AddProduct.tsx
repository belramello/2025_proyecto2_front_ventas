import React, { useState, useEffect } from "react";
import "./AddProduct.css";
import { MarcasService } from "../../services/marcasService";
import type { Marca } from "../../marcas/interfaces/marca.interface";

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

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loadingMarcas, setLoadingMarcas] = useState(true);

  // === Cargar marcas al montar el componente ===
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const data = await MarcasService.getMarcas();
        setMarcas(data);
      } catch (error) {
        console.error("Error al cargar las marcas:", error);
      } finally {
        setLoadingMarcas(false);
      }
    };
    fetchMarcas();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Producto agregado:", product);
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

          <div className="form-row">
            <div className="form-group">
              <label>Línea</label>
              <select
                name="line"
                value={product.line}
                onChange={handleSelectChange}
              >
                <option value="">Selecciona una línea</option>
                <option value="Escolar">Escolar</option>
                <option value="Oficina">Oficina</option>
              </select>
              <button type="button" className="btn pink">
                NUEVA LÍNEA
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Proveedor</label>
              <select
                name="provider"
                value={product.provider}
                onChange={handleSelectChange}
              >
                <option value="">Selecciona un proveedor</option>
                <option value="Distribuidora Ermini">
                  Distribuidora Ermini
                </option>
              </select>
              <button type="button" className="btn red">
                AGREGAR PROVEEDOR +
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
          </div>

          <div className="form-actions">
            <button type="submit" className="btn green">
              GUARDAR
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddProduct;
