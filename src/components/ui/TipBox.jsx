import { HiOutlineLightBulb } from "react-icons/hi"
export default function TipBox({ text }) {
  return (
    <div className="tip-box">
      <div className="tip-box_icon">
        <HiOutlineLightBulb/>
      </div>
      {text}
    </div>
  )
}
