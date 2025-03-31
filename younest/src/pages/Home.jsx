import PoSCard from "../components/PoSCard";
import { useState, useEffect } from "react";
import { getProductsOrServices } from "../services/api";
import "../css/Home.css";
import React from 'react'
import FilterPane from "../components/FilterPane";
import { FaSearch } from "react-icons/fa";
import BackToTopButton from "../components/BackToTopButton";



const Home = () => {
   const [pos, setPoS] = useState([]);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(false);
   const [len,setLen] = useState(true);
   const [le,setLe] = useState();

   useEffect(() => {
     const loadpos = async () => {
       try {
         setLoading(true); 
         const pos = await getProductsOrServices();
         setLoading(false);
         setPoS(pos);
       } catch (err) {
         setLoading(false);
         setError("Failed to load items...");
       } finally {
         setLoading(false);
       }
     };
 
     loadpos();
   }, []);

   const filters = ['All', 'electronics','clothing','food','houseware','body care','banking','mobile money','recreation','healthcare','other'];
   const [flt,setFlt] = useState('All')
   const [selectedFilter, setSelectedFilter] = useState('All');

   const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);  // Update active filter
    setPoS([]);  
    setLoading(true);  
    fetch(`https://younestapi.publicvm.com/api/filter-products/?category=${filter}`)
        .then((response) => response.json())
        .then((data) => 
        {
          setLoading(false);
          setPoS(data.products);
          console.log(data)
          console.log(data.products)
          setFlt(filter);
          if(data.products.length==0){
            setLen(false);
          }else{
            setLen(true);
            setLe(data.products.length)
          }
        }
        )
        .catch((error) => {
                      setLoading(false);
           
           setError(`Failed to load items for ${filter}`);        
   });
};

const [searchQuery, setSearchQuery] = useState("");

const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
};

    // Handle 'Enter' key press
const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
          handleSearch(); 
      }
  };

 
const handleSearch = () => {
  setLoading(true);
  setPoS([]); 
  setLen(true);
  setSelectedFilter('All')
  if (searchQuery.trim() !== "") {
    fetch(`https://younestapi.publicvm.com/api/search/?query=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false); 
        setPoS(data.results);  
        setLe(data.results.length)
      })
      .catch((error) =>{
         setLoading(false);
         setError(`Failed to search items for ${searchQuery}`);        
  });
  }
};


  return (
    <div className="home px-1">
        <div className="search-bar">
            <input type="text"
             placeholder="Search products or services here...."
             value={searchQuery} 
             onChange={handleSearchChange}
             onKeyDown={handleKeyDown}
             className="text-secondary"
             />
            <button id="search-button" onClick={handleSearch}>
              <FaSearch/>
            </button>
        </div>


    <FilterPane  filters={filters}
     onFilterSelect={handleFilterSelect}
     setSelectedFilter={setSelectedFilter}
     selectedFilter={selectedFilter}
     />

     

       <div className="row">
       {error && <div className="error-message">{error}</div>}
       {loading ? (
        <center>
           <div className="loading  p-5 mt-5">
          
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only"></span>
              </div>
              <span className="ms-2">Loading data...</span>
      
        </div>
        </center>
      ) : (
          !len ? (<div style={{margin:"20px"}}>No results found for {flt}</div>

         ):(<>
            <center><h6 style={{marginTop:"5px"}}>{le && <>{le} Result(s)</>}</h6></center>
            <div className="pos-grid"> 
            {pos?.map((p) => (
              <div className="col" key={p.id}><PoSCard p={p}  /></div>
            ))}
          </div>
         </>
          )
        
      )}
       </div>
       <BackToTopButton/>
    </div>
  )
}

export default Home




