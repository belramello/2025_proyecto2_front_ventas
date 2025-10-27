import { Modal, Button } from "react-bootstrap";
import type { Producto } from "../interfaces/producto-interface";

// --- Interfaces ---
interface ProveedoresModalProps {
  show: boolean;
  onHide: () => void;
  producto: Producto | null;
  // Opcional: podrías pasar los proveedores como prop si se cargan en el componente padre
  // proveedores: Proveedor[] | null; 
  // isLoading: boolean;
  // error: string | null;
}

// --- Componente ---
const ProveedoresModal = ({
  show,
  onHide,
  producto,
}: ProveedoresModalProps) => {

  // --- Estados Internos (Placeholder) ---
  // Aquí podrías manejar la carga de proveedores específica para este modal
  // const [proveedores, setProveedores] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // --- useEffect (Placeholder) ---
  // Se dispararía cuando el modal se abre y hay un producto seleccionado
  /*
  useEffect(() => {
    if (show && producto) {
      // Aquí llamarías al servicio para buscar proveedores por producto.id
      // const fetchProveedores = async () => {
      //   setIsLoading(true);
      //   setError(null);
      //   try {
      //     // const data = await ProveedoresService.getProveedoresPorProducto(producto.id);
      //     // setProveedores(data);
      //   } catch (err) {
      //     setError("Error al cargar proveedores.");
      //   } finally {
      //     setIsLoading(false);
      //   }
      // };
      // 
      // fetchProveedores();
    } else {
      // Limpiar estado cuando el modal se cierra
      // setProveedores([]);
      // setIsLoading(false);
      // setError(null);
    }
  }, [show, producto]);
  */


  // --- Renderizado del contenido del Body ---
  const renderContent = () => {
    // --- Descomentar cuando la lógica de carga esté lista ---
    // if (isLoading) {
    //   return <LoadingSpinner />;
    // }
    //
    // if (error) {
    //   return <ErrorMessage message={error} onRetry={() => { /* re-fetch logic */ }} />;
    // }
    //
    // if (proveedores.length === 0) {
    //   return <p>Este producto no tiene proveedores asociados.</p>;
    // }
    //
    // return (
    //   <ul>
    //     {proveedores.map((prov) => (
    //       <li key={prov.id}>{prov.nombre}</li>
    //     ))}
    //   </ul>
    // );

    // --- Contenido Placeholder (temporal) ---
    return (
      <p>
        Aquí se mostrará la lista de proveedores para el producto seleccionado.
        <br />
        (Funcionalidad pendiente de implementación)
      </p>
    );
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Proveedores de: {producto ? producto.nombre : "Producto"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {renderContent()}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProveedoresModal;