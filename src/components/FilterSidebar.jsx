
import { SlidersHorizontal, Star, RotateCcw } from "lucide-react";

export default function FilterSidebar({ filters, setFilters, onReset }) {
  function update(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <aside className="filter-sidebar">
      <div className="filter-heading">
        <h3><SlidersHorizontal size={18} /> Filters</h3>
        <button type="button" onClick={onReset} className="reset-button"><RotateCcw size={13} /> Reset</button>
      </div>

      <div className="filter-group">
        <h4>Maximum price per night</h4>
        <div className="filter-price-value">₹{Number(filters.maxPrice).toLocaleString("en-IN")}</div>
        <input
          type="range"
          min="3000"
          max="25000"
          step="500"
          value={filters.maxPrice}
          onChange={(event) => update("maxPrice", Number(event.target.value))}
          aria-label="Maximum price per night"
        />
        <div className="range-labels"><span>₹3,000</span><span>₹25,000+</span></div>
      </div>

      <div className="filter-group">
        <h4>Guest rating</h4>
        {[0, 4, 4.5, 4.8].map((rating) => (
          <label className="filter-option" key={rating}>
            <input
              type="radio"
              name="rating"
              checked={Number(filters.minRating) === rating}
              onChange={() => update("minRating", rating)}
            />
            <span>{rating === 0 ? "All ratings" : `${rating}+`}</span>
            {rating !== 0 && <span className="filter-rating"><Star size={12} fill="currentColor" /></span>}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Stay type</h4>
        {["Luxury", "Resort", "Boutique", "Mountain Retreat", "Heritage", "Nature Stay"].map((category) => (
          <label className="filter-option" key={category}>
            <input
              type="checkbox"
              checked={filters.categories.includes(category)}
              onChange={(event) => update(
                "categories",
                event.target.checked
                  ? [...filters.categories, category]
                  : filters.categories.filter((item) => item !== category)
              )}
            />
            <span>{category}</span>
          </label>
        ))}
      </div>

      <p className="filter-note">Prices and availability are sample data for this frontend demonstration.</p>
    </aside>
  );
}
