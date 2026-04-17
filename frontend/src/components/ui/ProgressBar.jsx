export default function ProgressBar({ value = 0 }) {

  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
