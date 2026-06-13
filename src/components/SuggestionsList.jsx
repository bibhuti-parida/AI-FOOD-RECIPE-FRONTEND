function SuggestionsList({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="suggestions-list-container">
      <h3>💡 Recipe Suggestions</h3>
      <p className="suggestions-subtitle">Click on any suggestion to generate the full recipe:</p>
      <div className="suggestions-grid">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="suggestion-card"
            onClick={() => onSelect(suggestion.title)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(suggestion.title);
              }
            }}
          >
            <h4>{suggestion.title}</h4>
            <p>{suggestion.description}</p>
            <div className="suggestion-meta">
              {suggestion.difficulty && (
                <span className={`difficulty-badge ${suggestion.difficulty.toLowerCase()}`}>
                  {suggestion.difficulty}
                </span>
              )}
              {suggestion.cookTime && <span>⏱️ {suggestion.cookTime}</span>}
            </div>
            {suggestion.dietaryTags && suggestion.dietaryTags.length > 0 && (
              <div className="recipe-tags">
                {suggestion.dietaryTags.map((tag, i) => (
                  <span key={i} className="diet-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuggestionsList;