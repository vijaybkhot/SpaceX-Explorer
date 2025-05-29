import { useNavigate } from "react-router-dom";
import GoBackButton from "./GoBackButton";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="launches-page">
      <div className="launches-container">
        <h1
          className="launches-title"
          style={{ fontSize: "6rem", color: "#a0a0a0" }}
        >
          404
        </h1>
        <h2
          className="launches-title"
          style={{ fontSize: "2rem", marginBottom: "1rem" }}
        >
          Page Not Found
        </h2>
        <p style={{ color: "#ccc", fontSize: "1.1rem", marginBottom: "2rem" }}>
          The page you are looking for does not exist.
        </p>

        <GoBackButton />

        <button
          onClick={() => navigate("/")}
          className="go-back-button"
          style={{ marginTop: "1.5rem" }}
        >
          Go To Homepage
        </button>
      </div>
    </div>
  );
}

export default NotFound;
