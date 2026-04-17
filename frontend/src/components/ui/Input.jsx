export default function Input({
  label,
  value,
  onChange,
  placeholder,
  className = "",
  ...props
}) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}

      <input
        className={`form-input ${className}`}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    </div>
  )
}
