"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const locations = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
];

const searchSuggestions = [
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Ayurveda",
  "Orthopedician",
  "General Physician",
  "Ayurveda Specialist",
  "Ayurveda Medicine",
];

export default function Main() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [filteredSearch, setFilteredSearch] = useState<string[]>([]);
  const [locationIndex, setLocationIndex] = useState(-1);
  const [queryIndex, setQueryIndex] = useState(-1); 
  const locationRef = useRef<HTMLDivElement>(null);
  const queryRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const locParam = searchParams.get("location") || "";
    const queryParam = searchParams.get("searchQuery") || ""; 
    if (locParam) setLocation(locParam);
    if (queryParam) setQuery(queryParam);
  }, [searchParams]);

  // Filter locations
  useEffect(() => {
    if (location.trim() === "") {
      setFilteredLocations([]);
      setLocationIndex(-1);
      return;
    }
    const filtered = locations.filter((loc) =>
      loc.toLowerCase().includes(location.toLowerCase().trim())
    );
    setFilteredLocations(filtered);
    setLocationIndex(-1);
  }, [location]);

  // Filter search suggestions
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredSearch([]);
      setQueryIndex(-1);
      return;
    }
    const filtered = searchSuggestions.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase().trim())
    );
    setFilteredSearch(filtered);
    setQueryIndex(-1);
  }, [query]);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setFilteredLocations([]);
        setLocationIndex(-1);
      }
      if (
        queryRef.current &&
        !queryRef.current.contains(event.target as Node)
      ) {
        setFilteredSearch([]);
        setQueryIndex(-1);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  const navigateToResults = (locationValue: string, queryValue: string) => {
    const params = new URLSearchParams();
    if (locationValue.trim()) params.append("location", locationValue.trim());
    if (queryValue.trim()) params.append("searchQuery", queryValue.trim());
    
   
    if (params.toString()) {
      router.push(`/doctors?${params.toString()}`);
    }
  };

  
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    inputType: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    
      if (inputType === "location" && locationIndex >= 0) {
        const selectedLocation = filteredLocations[locationIndex];
        setLocation(selectedLocation);
        setFilteredLocations([]);
        setLocationIndex(-1);
        navigateToResults(selectedLocation, query);
        return;
      }
      if (inputType === "query" && queryIndex >= 0) {
        const selectedQuery = filteredSearch[queryIndex];
        setQuery(selectedQuery);
        setFilteredSearch([]);
        setQueryIndex(-1);
        navigateToResults(location, selectedQuery);
        return;
      }
     
      navigateToResults(location, query);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (inputType === "location" && filteredLocations.length > 0) {
        setLocationIndex((prev) => (prev + 1) % filteredLocations.length);
      } else if (inputType === "query" && filteredSearch.length > 0) {
        setQueryIndex((prev) => (prev + 1) % filteredSearch.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (inputType === "location" && filteredLocations.length > 0) {
        setLocationIndex(
          (prev) => (prev - 1 + filteredLocations.length) % filteredLocations.length
        );
      } else if (inputType === "query" && filteredSearch.length > 0) {
        setQueryIndex(
          (prev) => (prev - 1 + filteredSearch.length) % filteredSearch.length
        );
      }
    }
  };


  const handleSelect = (value: string, inputType: string) => {
    if (inputType === "location") {
      setLocation(value);
      setFilteredLocations([]);
      setLocationIndex(-1);
      navigateToResults(value, query);
    } else if (inputType === "query") {
      setQuery(value);
      setFilteredSearch([]);
      setQueryIndex(-1);
      navigateToResults(location, value);
    }
  };


  const isValidLocation = locations.some(
    (loc) => loc.toLowerCase() === location.toLowerCase().trim()
  );

  return (
    <main className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center pt-0">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <Image
          src="/background_1.svg"
          alt="Background Illustration"
          fill
          sizes="100vw"
          className="object-cover opacity-90"
          priority
        />
      </div>
      <div className="relative max-w-3xl w-full text-center text-[#1d1d1d] px-4 md:px-12">
        <div className="flex items-start justify-center mb-6 md:mb-[15vw]">
          <h1 className="text-2xl sm:text-5xl md:text-5xl font-bold mb-2 text-white">
            Your home for health
          </h1>
        </div>
        <p className="text-sm sm:text-base md:text-lg font-medium mb-6 text-white">
          Find and Book
        </p>
        <form className="bg-white shadow-md flex flex-col sm:flex-row w-full max-w-lg sm:max-w-2xl mx-auto">
          <div
            className="relative flex items-center w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-gray-200"
            ref={locationRef}
          >
            <span className="pl-2 pr-1">
              <svg
                className="h-5 w-5 text-gray-500"
                fill="#000000"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.114-0.011c-6.559 0-12.114 5.587-12.114 12.204 0 6.93 6.439 14.017 10.77 18.998 0.017 0.020 0.717 0.797 1.579 0.797h0.076c0.863 0 1.558-0.777 1.575-0.797 4.064-4.672 10-12.377 10-18.998 0-6.618-4.333-12.204-11.886-12.204zM16.515 29.849c-0.035 0.035-0.086 0.074-0.131 0.107-0.046-0.032-0.096-0.072-0.133-0.107l-0.523-0.602c-4.106-4.71-9.729-11.161-9.729-17.055 0-5.532 4.632-10.205 10.114-10.205 6.829 0 9.886 5.125 9.886 10.205 0 4.474-3.192 10.416-9.485 17.657zM16.035 6.044c-3.313 0-6 2.686-6 6s2.687 6 6 6 6-2.687 6-6-2.686-6-6-6zM16.035 16.044c-2.206 0-4.046-1.838-4.046-4.044s1.794-4 4-4c2.207 0 4 1.794 4 4 0.001 2.206-1.747 4.044-3.954 4.044z"></path>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "location")}
              className="px-2 py-3 text-sm sm:text-base focus:outline-none flex-grow"
              autoComplete="off"
            />
            {filteredLocations.length > 0 ? (
              <ul className="absolute left-0 top-[100%] mt-1 bg-white border border-gray-300 w-full max-h-40 overflow-auto z-50 text-left text-gray-800 text-sm shadow-lg">
                {filteredLocations.map((loc, index) => (
                  <li
                    key={loc}
                    className={`cursor-pointer px-3 py-2 hover:bg-gray-200 ${
                      index === locationIndex ? "bg-blue-200" : ""
                    }`}
                    onClick={() => handleSelect(loc, "location")}
                    onMouseEnter={() => setLocationIndex(index)}
                  >
                    {loc}
                  </li>
                ))}
              </ul>
            ) : location.trim() !== "" && !isValidLocation ? (
              <div className="absolute left-0 top-[100%] mt-1 bg-white border border-gray-300 w-full text-gray-500 text-sm p-2 z-50">
                No matching locations
              </div>
            ) : null}
          </div>
          <div className="relative flex-grow" ref={queryRef}>
            <input
              type="text"
              placeholder="Search doctors, clinics, hospitals, etc."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "query")}
              className="px-4 py-3 text-sm sm:text-base focus:outline-none w-full"
              autoComplete="off"
            />
            {filteredSearch.length > 0 ? (
              <ul className="absolute left-0 top-[100%] mt-1 bg-white border border-gray-300 w-full max-h-40 overflow-auto z-50 text-left text-gray-800 text-sm shadow-lg">
                {filteredSearch.map((item, index) => (
                  <li
                    key={item}
                    className={`cursor-pointer px-3 py-2 hover:bg-gray-200 ${
                      index === queryIndex ? "bg-blue-200" : ""
                    }`}
                    onClick={() => handleSelect(item, "query")}
                    onMouseEnter={() => setQueryIndex(index)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : query.trim() !== "" &&
              !searchSuggestions.some(
                (item) => item.toLowerCase() === query.toLowerCase().trim()
              ) ? (
              <div className="absolute left-0 top-[100%] mt-1 bg-white border border-gray-300 w-full text-gray-500 text-sm p-2 z-50">
                No matching suggestions
              </div>
            ) : null}
          </div>
        </form>
        <div className="mt-4 text-xs md:text-sm text-gray-400 flex flex-wrap items-center gap-x-4 gap-y-2 w-full max-w-lg lg:max-w-2xl mx-auto">
          <span>Popular searches:</span>
          <span>Dermatologist</span>
          <span>Pediatrician</span>
          <span>Gynecologist/Obstetrician</span>
          <span>Others</span>
        </div>
      </div>
    </main>
  );
}