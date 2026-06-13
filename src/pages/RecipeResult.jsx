import { useNavigate } from "react-router-dom";
import { useRecipe } from "../context/RecipeContext";
import RecipeDisplay from "../components/RecipeDisplay";

function RecipeResult() {
  const navigate = useNavigate();
  const { recipe, clearRecipe } = useRecipe();

  const handleBack = () => {
    clearRecipe();
    navigate("/");
  };

  if (!recipe) {
    return (
      <div className="recipe-result-page">
        <button className="back-btn" onClick={handleBack}>
          ← Back to Home
        </button>
        <div className="empty-state">
          <h2>🔍 No Recipe Generated Yet</h2>
          <p>Upload some ingredients or get suggestions to generate a personalized recipe</p>
          <button className="primary-btn" onClick={handleBack}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-result-page">
      <button className="back-btn" onClick={handleBack}>
        ← Back to Home
      </button>
      <h2>✨ Your AI-Generated Recipe</h2>
      <RecipeDisplay recipe={recipe} />
    </div>
  );
}

export default RecipeResult;
