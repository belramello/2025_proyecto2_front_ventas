import React from "react";

type Props = {
  message: string;
  onRetry?: () => void;
};

const ErrorMessage: React.FC<Props> = ({ message, onRetry }) => {
  return (
    <div className="mt-3">
      <div
        className="alert alert-danger d-flex justify-content-between align-items-center"
        role="alert"
      >
        <div>{message}</div>
        {onRetry && (
          <button className="btn btn-sm btn-outline-light" onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
