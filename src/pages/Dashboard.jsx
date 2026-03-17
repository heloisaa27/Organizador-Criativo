import { useNavigate } from "react-router-dom"

export default function Dashboard() {

  const navigate = useNavigate()

  return (
    <div>

      <h1>Minhas Histórias</h1>

      <div
        className="story-card"
        onClick={() => navigate("/story")}
        style={{cursor: "pointer"}}
      >
        <h3>Crônicas de Aurora</h3>
        <p>Uma saga de fantasia épica</p>
      </div>

    </div>
  )
}