"use client"; // This is a client component 👈🏽
import "./page.module.css";
import { useState, useEffect } from "react";
import { fetchImages } from "./api";
import LazyLoad from "react-lazyload";
import InfiniteScroll from "react-infinite-scroll-component";
import Autosuggest from "react-autosuggest";

const App = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      const data = await fetchImages(searchQuery, page, 10);
      setImages((prevImages) => [...prevImages, ...data]);
      setLoading(false);
    };

    loadImages();
  }, [searchQuery, page]);

  const handleSearchChange = (event, { newValue }) => {
    setSearchQuery(newValue);
  };

  const getSuggestions = (value) => {
    const suggestions = ["canada", "cannabis", "canada day"]; // Predefined values for suggestions
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : suggestions.filter(
          (suggestion) =>
            suggestion.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const renderSuggestion = (suggestion) => <span>{suggestion}</span>;

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: "Search",
    value: searchQuery,
    onChange: handleSearchChange,
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="App">
      <h1>Gallery Web App</h1>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <InfiniteScroll
          dataLength={images.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<p>Loading more...</p>}
        >
          <div className="image-grid">
            {images.map((image) => (
              <LazyLoad key={image.id} height={200} offset={100}>
                <div className="image-card">
                  <img src={image.urls.regular} alt={image.alt_description} />
                  <div className="image-details">
                    <h3>
                      Instagram username:- {image.user.instagram_username}
                    </h3>
                    <h4>Like:- {image.likes}</h4>
                    <p>Bio:- {image.user.bio}</p>
                    <img
                      src={image.user.profile_image.small}
                      alt={image.user.username}
                    />
                  </div>
                </div>
              </LazyLoad>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default App;
