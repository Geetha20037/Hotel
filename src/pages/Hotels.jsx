
import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowUpRight, SlidersHorizontal, X, SearchX } from "lucide-react";
import { hotels } from "../data/hotels";
import SearchBar from "../components/SearchBar";
import HotelCard from "../components/HotelCard";
import FilterSidebar from "../components/FilterSidebar";

const DEFAULT_FILTERS = {
  maxPrice: 25000,
  minRating: 0,
  categories: []
};

export default function Hotels() {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get("destination") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "2";
  const rooms = searchParams.get("rooms") || "1";

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const query = destination.trim().toLowerCase();

    const filtered = hotels.filter((hotel) => {
      const matchesDestination = !query ||
        hotel.city.toLowerCase().includes(query) ||
        hotel.location.toLowerCase().includes(query) ||
        hotel.name.toLowerCase().includes(query) ||
        hotel.category.toLowerCase().includes(query);

      const matchesPrice = hotel.price <= filters.maxPrice;
      const matchesRating = hotel.rating >= filters.minRating;
      const matchesCategory = filters.categories.length === 0 ||
        filters.categories.includes(hotel.category);

      return matchesDestination && matchesPrice && matchesRating && matchesCategory;
    });

    if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);

    return filtered;
  }, [destination, filters, sortBy]);

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setSortBy("recommended");
  }

  return (
    <main className="listing-page">
      <section className="listing-banner">
        <div className="container listing-banner-inner">
          <div>
            <span className="eyebrow">THE STAYORA COLLECTION</span>
            <h1>Somewhere <em>beautiful.</em></h1>
            <p>Explore places that make getting away feel extraordinary.</p>
          </div>
          <div className="listing-banner-stamp"><span>CURATED</span><strong>S.</strong><span>WITH CARE</span></div>
        </div>
      </section>

      <section className="listing-search container">
        <SearchBar compact initialValues={{ destination, checkIn, checkOut, guests, rooms }} />
      </section>

      <section className="container listing-layout">
        <div className={`mobile-filter-backdrop ${mobileFiltersOpen ? "visible" : ""}`} onClick={() => setMobileFiltersOpen(false)} />
        <div className={`filter-drawer ${mobileFiltersOpen ? "filter-drawer-open" : ""}`}>
          <div className="mobile-filter-heading">
            <h3>Refine your search</h3>
            <button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters"><X /></button>
          </div>
          <FilterSidebar filters={filters} setFilters={setFilters} onReset={resetFilters} />
        </div>

        <div className="listing-results">
          <div className="results-toolbar">
            <div>
              <span className="eyebrow">YOUR NEXT GETAWAY</span>
              <h2>{destination ? `Stays in ${destination}` : "All beautiful stays"}</h2>
              <p>{results.length} {results.length === 1 ? "property" : "properties"} to discover</p>
            </div>

            <div className="results-actions">
              <button type="button" className="mobile-filter-button" onClick={() => setMobileFiltersOpen(true)}>
                <SlidersHorizontal size={16} /> Filters
              </button>
              <label className="sort-control">
                <span>Sort by</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="rating">Highest rated</option>
                </select>
              </label>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="hotel-grid listing-hotel-grid">
              {results.map((hotel, index) => <HotelCard key={hotel.id} hotel={hotel} index={index} />)}
            </div>
          ) : (
            <div className="empty-state">
              <SearchX size={42} strokeWidth={1.2} />
              <h3>No stays found just yet.</h3>
              <p>Try a different destination or adjust your filters to see more options.</p>
              <button type="button" className="button button-dark" onClick={resetFilters}>Reset filters</button>
              <Link to="/hotels" className="text-link">Browse all stays <ArrowUpRight size={16} /></Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
