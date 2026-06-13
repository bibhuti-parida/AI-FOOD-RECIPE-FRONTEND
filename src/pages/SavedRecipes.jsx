import { useEffect, useState, useMemo } from "react";
import { useRecipe } from "../context/RecipeContext";
import RecipeCard from "../components/RecipeCard";
import Loader from "../components/Loader";

function SavedRecipes() {
  const { savedRecipes, fetchSavedRecipes, loading } = useRecipe();
  const [filterDiet, setFilterDiet] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSavedRecipes().catch(() => {});
  }, [fetchSavedRecipes]);

  const filteredRecipes = useMemo(() => {
    return savedRecipes.filter((recipe) => {
      const matchesDiet = filterDiet ? recipe.dietaryTags?.includes(filterDiet) : true;
      const matchesDifficulty = filterDifficulty ? recipe.difficulty === filterDifficulty : true;
      const matchesSearch = searchTerm
        ? recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesDiet && matchesDifficulty && matchesSearch;
    });
  }, [savedRecipes, filterDiet, filterDifficulty, searchTerm]);

  if (loading) {
    return <Loader message="Loading your favorite recipes..." />;
  }

  return (
    <div className="saved-recipes-page">
      <h2>❤️ Saved Recipes</h2>

      {savedRecipes.length > 0 && (
        <div className="filters-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search recipes..."
            className="search-input"
          />

          <select
            value={filterDiet}
            onChange={(e) => setFilterDiet(e.target.value)}
            className="filter-select"
          >
            <option value="">🥗 All Diets</option>
            <option value="vegan">🌱 Vegan</option>
            <option value="vegetarian">🥬 Vegetarian</option>
            <option value="keto">🥓 Keto</option>
            <option value="gluten-free">🌾 Gluten-Free</option>
            <option value="dairy-free">🥛 Dairy-Free</option>
            <option value="low-carb">⚡ Low Carb</option>
            <option value="high-protein">💪 High Protein</option>
            <option value="paleo">🍖 Paleo</option>
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="filter-select"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">😊 Easy</option>
            <option value="Medium">👨‍🍳 Medium</option>
            <option value="Hard">🔥 Hard</option>
          </select>
        </div>
      )}

      {filteredRecipes.length === 0 ? (
        <div className="empty-state">
          {savedRecipes.length === 0 ? (
            <>
              <h2>📋 No Saved Recipes Yet</h2>
              <p>Generate a delicious recipe and save your favorites to access them anytime!</p>
            </>
          ) : (
            <>
              <h2>🔍 No Recipes Found</h2>
              <p>Try adjusting your filters to find what you're looking for.</p>
            </>
          )}
        </div>
      ) : (
        <>
          <p style={{ textAlign: "center", color: "var(--text-light)", marginBottom: "2rem", fontSize: "0.95rem" }}>
            Showing {filteredRecipes.length} of {savedRecipes.length} recipes
          </p>
          <div className="recipes-grid">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} isSaved />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SavedRecipes;
