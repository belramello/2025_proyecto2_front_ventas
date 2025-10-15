// src/components/LoadingSpinner.tsx
const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center mt-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
