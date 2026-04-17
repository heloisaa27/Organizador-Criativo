import { HiOutlineLightBulb } from "react-icons/hi"
export default function TipBox({ 
  text,
  color 
}) {
  return (
    <div className={`tip-box tip-box--${color}`}>
      <div className="tip-box_icon">
        <HiOutlineLightBulb/>
      </div>
      {text}
    </div>
  )
}
