export default function Input({
  label,
  value,
  onChange,
  placeholder,
  className = "",
  type = "text",
  ...props
}) {
  const isFile = type === "file"


  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}


      <input
        type={type}
        className={`form-input ${className}`}
        {...(!isFile && { value: value || "" })}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    </div>
  )
}
