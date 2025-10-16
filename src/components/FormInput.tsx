import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  placeholder?: string;
  required?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  className?: string;
  minLength?: number;
}

function FormInput({
  label,
  name,
  type = "text",
  value,
  placeholder,
  required = false,
  onChange,
  className = "",
  minLength,
}: FormInputProps) {
  return (
    <div className={`mb-3 ${className}`}>
      <label className="form-label fw-bold">{label}</label>
      <input
        type={type}
        className="form-control"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
    </div>
  );
}

export default FormInput;
