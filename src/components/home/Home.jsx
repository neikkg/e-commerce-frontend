import { useState } from "react";
import BestDealsHome from "./BestDealsHome";
import BestOfElectronics from "./BestOfElectronics";
import BestSellersHome from "./BestSellersHome";
import SearchBar from "./SearchBar";
import TopStyles from "./TopStyles";

const Home = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState("");

    const handleSearchResults = (results, searchQuery) => {
        setSearchResults(results);
        setQuery(searchQuery);
    }
    return (
        <>
          <SearchBar onSearchResults={handleSearchResults} />
    
          {/* Render default sections only when no search query */}
          {!query && (
            <>
              <BestOfElectronics />
              <TopStyles />
              <BestDealsHome />
              <BestSellersHome/>
            </>
          )}
        </>
      );
    };

export default Home;