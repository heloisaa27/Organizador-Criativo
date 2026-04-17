import ProgressBar from "./ProgressBar"
import { tempoRelativo } from "../../utils/tempo"
import { FiClock } from "react-icons/fi"

export default function SectionStatus({
  color = "green",
  icon: Icon,
  title,
  subtitle,
  progress,
  showProgress = false,
  lastEdited
}) {
  return (
    <div className={`section-status section-status--${color}`}>
      <div className="section-status__icon">
        {Icon ? <Icon /> : null}
      </div>

      <div className="section-status__content">
        <div className="section-status__top">
          <strong>{title}</strong>

          {showProgress && (
            <span className="section-status__progress-value">
              {progress}%
            </span>
          )}
        </div>

        {showProgress && <ProgressBar value={progress} />}

        {subtitle && (
          <p className="section-status__subtitle">{subtitle}</p>
        )}

        {lastEdited && (
          <div className="section-status__last-edited">
            <FiClock className="section-status-last-edited-icon" />
            <span>
              Última alteração: {tempoRelativo(lastEdited)}
            </span>
          </div>
        )}

      </div>
    </div>
  )
}