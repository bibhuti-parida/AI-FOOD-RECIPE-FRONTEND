import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import RecipeDisplay from "../components/RecipeDisplay";
import Loader from "../components/Loader";

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/api/recipes`;
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "/api/recipes";
    }
  }

  return "https://ai-food-recipe-backend.onrender.com/api/recipes";
};

const API_BASE = getApiBase();

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/saved/${id}`);
        setRecipe(data);
      } catch (err) {
        setError("Recipe not found. It may have been deleted.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <Loader message="Loading your recipe..." />;
  }

  if (error) {
    return (
      <div className="recipe-detail-page">
        <button className="back-btn" onClick={() => navigate("/saved")}>
          ← Back to Saved Recipes
        </button>
        <div className="empty-state">
          <h2>⚠️ {error}</h2>
          <button className="primary-btn" onClick={() => navigate("/saved")}>
            Return to Saved Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail-page">
      <button className="back-btn" onClick={() => navigate("/saved")}>
        ← Back to Saved Recipes
      </button>
      <RecipeDisplay recipe={recipe} />
    </div>
  );
}

export default RecipeDetail;
