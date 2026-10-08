import { useNavigate } from "react-router-dom";

const CatchAll = () => {
  const navigate = useNavigate();
  return (
    <>
      <h1>404 - Page not found</h1>
      <button onClick={() => navigate("/")}>Go Home</button>
    </>
  );
};

export default CatchAll;
