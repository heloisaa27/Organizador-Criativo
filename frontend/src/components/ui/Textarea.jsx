export default function Textarea({
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

      <textarea
        className={`form-input textarea ${className}`}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    </div>
  )
}


