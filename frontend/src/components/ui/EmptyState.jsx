import Button from "./Button"

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  hint
}) {
  return (
    <div className="empty-state">

      {Icon && <Icon className="empty-icon" />}

      <h3>{title}</h3>

      <p className="empty-description">
        {description}
      </p>

      {hint && (
        <p className="empty-hint">
          {hint}
        </p>
      )}

      <Button
        variant="primary"
        className="empty-action"
        onClick={onAction}
      >
        + {actionText}
      </Button>

    </div>
  )
}
