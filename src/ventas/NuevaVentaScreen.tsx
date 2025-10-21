import { useState } from "react";
import QuantityButton from "../components/QuantityButton";
import type { Producto } from "../productos/interfaces/producto-interface";
import type { MedioDePago } from "../types/MedioDePagoType";
import "./NuevaVentaScreen.css";
import SearchProductBar from "./components/SearchProductBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { ProductosService } from "../services/productosService";
import { VentasService } from "../services/ventasService";

function NuevaVentaScreen() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [medioDePago, setMedioDePago] = useState<MedioDePago>("efectivo");
  const [codigoBusqueda, setCodigoBusqueda] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [registroLoading, setRegistroLoading] = useState(false);
  const [registroError, setRegistroError] = useState<string | null>(null);

  const buscarProducto = async () => {
    const codigo = codigoBusqueda.trim();
    setSearchError(null);
    if (!codigo) {
      setSearchError("Ingresá un código.");
      return;
    }

    // verificar duplicado por código
    if (productos.some((p) => p.codigo === codigo)) {
      setSearchError("Ese producto ya está en el resumen.");
      return;
    }

    setSearchLoading(true);
    try {
      const producto: Producto =
        await ProductosService.obtenerProductoPorCodigo(codigo);

      if (!producto) {
        setSearchError("No se encontró ningún producto con ese código.");
        return;
      }

      if (producto.stock <= 0) {
        setSearchError("El producto no tiene stock disponible.");
        return;
      }

      // doble chequeo por si el backend devolviera un producto con mismo código
      if (productos.some((p) => p.codigo === producto.codigo)) {
        setSearchError("Ese producto ya está en el resumen.");
      } else {
        setProductos((prev) => [...prev, producto]);
        setCantidades((prev) => ({ ...prev, [producto.codigo]: 1 }));
        setCodigoBusqueda("");
      }
    } catch (err: any) {
      setSearchError("Error al buscar el producto. Intentá de nuevo.");
      console.error("Error buscarProducto:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCantidadChange = (codigo: string, delta: number) => {
    setSearchError(null);
    setCantidades((prev) => {
      const current = prev[codigo] || 0;
      const producto = productos.find((p) => p.codigo === codigo);
      if (!producto) return prev;

      const nuevaCantidad = Math.max(0, current + delta);

      // si se intenta aumentar más que el stock, no permitir y avisar
      if (nuevaCantidad > producto.stock) {
        setSearchError(
          `No hay stock suficiente. Stock disponible: ${producto.stock}.`
        );
        return prev;
      }

      return { ...prev, [codigo]: nuevaCantidad };
    });
  };

  const eliminarProducto = (codigo: string) => {
    setProductos((prev) => prev.filter((p) => p.codigo !== codigo));
    setCantidades((prev) => {
      const nuevo = { ...prev };
      delete nuevo[codigo];
      return nuevo;
    });
    setSearchError(null);
  };

  const calcularSubtotal = (p: Producto) =>
    (cantidades[p.codigo] || 0) * p.precio;
  const total = productos.reduce((acc, p) => acc + calcularSubtotal(p), 0);

  const registrarVenta = async () => {
    setRegistroError(null);
    if (productos.length === 0) {
      setRegistroError("Agregá al menos un producto para registrar la venta.");
      return;
    }
    const detalles: { productoId: number; cantidad: number }[] = [];
    for (const p of productos) {
      const cantidad = Math.max(0, cantidades[p.codigo] || 0);
      if (cantidad < 1) {
        setRegistroError(
          `Ingresá al menos 1 unidad para el producto "${p.nombre}".`
        );
        return;
      }
      if (cantidad > p.stock) {
        setRegistroError(
          `Cantidad para "${p.nombre}" supera el stock disponible (${p.stock}).`
        );
        return;
      }
      detalles.push({ productoId: p.id, cantidad });
    }

    const dto = {
      detalles,
      medioDePago,
    } as {
      detalles: { productoId: number; cantidad: number }[];
      medioDePago: "efectivo" | "credito" | "debito";
    };

    setRegistroLoading(true);
    try {
      await VentasService.registrarVenta(dto);
      setProductos([]);
      setCantidades({});
      setCodigoBusqueda("");
      setRegistroError(null);
      alert("Venta registrada correctamente.");
    } catch (err: any) {
      console.error("Error registrarVenta:", err);
      setRegistroError(
        err?.message || "Error al registrar la venta. Intentá de nuevo."
      );
    } finally {
      setRegistroLoading(false);
    }
  };
  return (
    <>
      <h1 className="titulo-nueva-venta">Nueva Venta</h1>
      <p className="descripcion-nueva-venta">
        Ingresá productos para registrar una nueva venta.
      </p>

      <div className="container mt-3">
        <div className="row">
          <div className="col-md-8">
            <div className="table-responsive">
              <table className="table align-middle text-center table-main">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Precio Unitario</th>
                    <th>Stock</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.codigo}>
                      <td>{p.codigo}</td>
                      <td>{p.nombre}</td>
                      <td>${p.precio.toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td>
                        <QuantityButton
                          quantity={cantidades[p.codigo] || 0}
                          onIncrease={() => handleCantidadChange(p.codigo, 1)}
                          onDecrease={() => handleCantidadChange(p.codigo, -1)}
                        />
                      </td>
                      <td>${calcularSubtotal(p).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger btn-eliminar-producto"
                          onClick={() => eliminarProducto(p.codigo)}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan={7}>
                      <SearchProductBar
                        value={codigoBusqueda}
                        onChange={setCodigoBusqueda}
                        onSearch={buscarProducto}
                      />
                      <div className="mt-2">
                        {searchLoading && <LoadingSpinner />}
                        {searchError && (
                          <ErrorMessage
                            message={searchError}
                            onRetry={buscarProducto}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-light resumen-venta-card">
              <div className="card-body">
                <h4 className="fw-bold titulo-resumen">Resumen de Venta</h4>

                <div className="table-responsive">
                  <table className="table text-center table-summary">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cant.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((p) => (
                        <tr key={p.codigo}>
                          <td className="text-start">{p.nombre}</td>
                          <td>{cantidades[p.codigo] || 0}</td>
                          <td>${calcularSubtotal(p).toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="fw-bold">
                        <td colSpan={2} className="text-end">
                          Total:
                        </td>
                        <td>${total.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 mb-3">
                  <label className="fw-bold mb-2">Medio de Pago:</label>
                  <select
                    className="form-select select-medio-pago"
                    value={medioDePago}
                    onChange={(e) =>
                      setMedioDePago(e.target.value as MedioDePago)
                    }
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="credito">Crédito</option>
                    <option value="debito">Débito</option>
                  </select>
                </div>
                {registroError && (
                  <ErrorMessage
                    message={registroError}
                    onRetry={registrarVenta}
                  />
                )}
                <button
                  className="btn btn-success w-100 fw-bold btn-registrar-venta"
                  type="submit"
                  onClick={() => registrarVenta()}
                >
                  {registroLoading ? "Registrando..." : "REGISTRAR VENTA"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NuevaVentaScreen;
