export default function Tag({
  children,
  active,
  onClick,
  onRemove
}) {
  return (
    <div className="tag-item">
      <span
        className={`tag ${active ? "active" : ""}`}
        onClick={onClick}
      >
        {children}
      </span>

      {onRemove && (
        <button
          className="remove-btn"
          onClick={onRemove}
        >
          ✕
        </button>
      )}
    </div>
  )
}
