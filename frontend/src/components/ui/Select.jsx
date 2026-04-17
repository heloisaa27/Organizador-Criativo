export default function Select({
  label,
  value,
  onChange,
  children,
  error
}) {
  return (
    <div className="form-group">

      {label && (
        <label className="form-label">
          {label}
        </label>
      )}

      <select
        className="form-input"
        value={value}
        onChange={onChange}
      >
        {children}
      </select>

      {error && (
        <span className="form-error">
          {error}
        </span>
      )}

    </div>
  )
}
