import { createContext, useState, useContext, useCallback } from "react";
import axios from "axios";

const RecipeContext = createContext();

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe must be used within a RecipeProvider");
  }
  return context;
};

export const RecipeProvider = ({ children }) => {
  const [ingredients,       setIngredients]       = useState([]);
  const [recipe,            setRecipe]            = useState(null);
  const [suggestions,       setSuggestions]       = useState([]);
  const [savedRecipes,      setSavedRecipes]      = useState([]);
  const [loading,           setLoading]           = useState(false);
  const [error,             setError]             = useState(null);
  const [dietaryPreference, setDietaryPreference] = useState("");

  const parseErrorMessage = (error, fallback) => {
    if (!error) return fallback;
    if (typeof error === "string") return error;
    if (error.response?.data) {
      const dataError = error.response.data.error ?? error.response.data.message ?? error.response.data;
      if (typeof dataError === "string") return dataError;
      if (typeof dataError === "object") return dataError.message || JSON.stringify(dataError);
    }
    if (error.message) return error.message;
    return String(error);
  };

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

  const analyzeImage = useCallback(async (imageFile) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const { data } = await axios.post(`${API_BASE}/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIngredients(data.ingredients);
      return data.ingredients;
    } catch (err) {
      const message = parseErrorMessage(err, "Failed to analyze image");
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateRecipe = useCallback(
    async (ingredientList, diet) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.post(`${API_BASE}/generate`, {
          ingredients: ingredientList || ingredients,
          dietaryPreference: diet || dietaryPreference,
        });

        setRecipe(data.recipe);
        return data.recipe;
      } catch (err) {
        const message = parseErrorMessage(err, "Failed to generate recipe");
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [ingredients, dietaryPreference]
  );

  const getRecipeSuggestions = useCallback(
    async (ingredientList, diet) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.post(`${API_BASE}/suggestions`, {
          ingredients: ingredientList || ingredients,
          dietaryPreference: diet || dietaryPreference,
        });

        setSuggestions(data.suggestions);
        return data.suggestions;
      } catch (err) {
        const message = parseErrorMessage(err, "Failed to get suggestions");
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [ingredients, dietaryPreference]
  );

  const saveRecipe = useCallback(async (recipeData) => {
    try {
      const { data } = await axios.post(`${API_BASE}/save`, recipeData);
      setSavedRecipes((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const message = parseErrorMessage(err, "Failed to save recipe");
      setError(message);
      throw new Error(message);
    }
  }, []);

  const fetchSavedRecipes = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`${API_BASE}/saved?${params}`);
      setSavedRecipes(data);
      return data;
    } catch (err) {
      const message = parseErrorMessage(err, "Failed to fetch recipes");
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSavedRecipe = useCallback(async (id) => {
    try {
      await axios.delete(`${API_BASE}/saved/${id}`);
      setSavedRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      const message = parseErrorMessage(err, "Failed to delete recipe");
      setError(message);
      throw new Error(message);
    }
  }, []);

  const clearRecipe = useCallback(() => {
    setRecipe(null);
    setSuggestions([]);
    setError(null);
  }, []);

  const value = {
    ingredients, setIngredients,
    recipe, setRecipe,
    suggestions,
    savedRecipes,
    loading,
    error, setError,
    dietaryPreference, setDietaryPreference,
    analyzeImage,
    generateRecipe,
    getRecipeSuggestions,
    saveRecipe,
    fetchSavedRecipes,
    deleteSavedRecipe,
    clearRecipe,
  };

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
};