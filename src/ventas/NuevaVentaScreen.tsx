import { useState } from "react";
import QuantityButton from "../components/QuantityButton";
import type { Producto } from "../interfaces/producto-interface";
import type { MedioDePago } from "../types/MedioDePagoType";
import "./NuevaVentaScreen.css";
import SearchProductBar from "../components/SearchProductBar";

const productosIniciales: Producto[] = [
  {
    id: 1,
    codigo: "0123",
    nombre: "Lápices Faber Castell",
    precioUnitario: 14000.5,
    stock: 40,
  },
  {
    id: 2,
    codigo: "0456",
    nombre: "Calculadora",
    precioUnitario: 10000.5,
    stock: 30,
  },
];

function NuevaVentaScreen() {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [cantidades, setCantidades] = useState<Record<string, number>>(
    productosIniciales.reduce((acc, p) => ({ ...acc, [p.codigo]: 1 }), {})
  );
  const [medioDePago, setMedioDePago] = useState<MedioDePago>("efectivo");
  const [codigoBusqueda, setCodigoBusqueda] = useState("");

  const buscarProducto = () => {
    console.log("Buscar producto con código:", codigoBusqueda);
  };

  const handleCantidadChange = (codigo: string, delta: number) => {
    setCantidades((prev) => {
      const nuevaCantidad = Math.max(0, (prev[codigo] || 0) + delta);
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
  };

  const calcularSubtotal = (p: Producto) =>
    (cantidades[p.codigo] || 0) * p.precioUnitario;
  const total = productos.reduce((acc, p) => acc + calcularSubtotal(p), 0);

  const registrarVenta = () => {
    console.log("Productos:", productos);
    console.log("Cantidades:", cantidades);
    console.log("Medio de pago:", medioDePago);
    console.log("Registrar venta");
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
                      <td>${p.precioUnitario.toFixed(2)}</td>
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
                    <option value="crédito">Crédito</option>
                    <option value="débito">Débito</option>
                  </select>
                </div>

                <button
                  className="btn btn-success w-100 fw-bold btn-registrar-venta"
                  type="submit"
                  onClick={() => registrarVenta()}
                >
                  REGISTRAR VENTA
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
