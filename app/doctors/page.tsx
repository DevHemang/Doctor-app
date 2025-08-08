"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

type Doctor = {
  location: string;
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  ratingCount: number;
  fees: number;
  photo: string;
  clinicName: string;
  availableToday: boolean;
  contactNumber: string | null;
  patientStories: number;
  gender: "male" | "female";
};

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

export default function DoctorPage() {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmedLocation, setConfirmedLocation] = useState("");
  const [confirmedSearchQuery, setConfirmedSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<"male" | "female" | "">("");
  const [patientStoriesFilter, setPatientStoriesFilter] = useState<number>(0);
  const [experienceFilter, setExperienceFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [showAllFiltersDropdown, setShowAllFiltersDropdown] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  // State for appointment modal
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [filteredSearch, setFilteredSearch] = useState<string[]>([]);
  const [locationIndex, setLocationIndex] = useState(-1);
  const [queryIndex, setQueryIndex] = useState(-1);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const queryRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const loc = searchParams.get("location") || "";
    const query = searchParams.get("searchQuery") || "";
    setLocation(loc);
    setSearchQuery(query);
    setConfirmedLocation(loc);
    setConfirmedSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    if (location.trim() === "") {
      setFilteredLocations([]);
      setLocationIndex(-1);
      setShowLocationDropdown(false);
      return;
    }

    const filtered = locations.filter((loc) =>
      loc.toLowerCase().includes(location.toLowerCase().trim())
    );
    setFilteredLocations(filtered);
    setLocationIndex(-1);
    setShowLocationDropdown(filtered.length > 0);
  }, [location]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSearch([]);
      setQueryIndex(-1);
      setShowSearchDropdown(false);
      return;
    }

    const filtered = searchSuggestions.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
    setFilteredSearch(filtered);
    setQueryIndex(-1);
    setShowSearchDropdown(filtered.length > 0);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
        setLocationIndex(-1);
      }
      if (
        queryRef.current &&
        !queryRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
        setQueryIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    inputType: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputType === "location") {
        if (locationIndex >= 0 && filteredLocations.length > 0) {
          const selectedLocation = filteredLocations[locationIndex];
          setLocation(selectedLocation);
          setConfirmedLocation(selectedLocation);
          setShowLocationDropdown(false);
          setLocationIndex(-1);
        } else {
          setConfirmedLocation(location);
          setShowLocationDropdown(false);
        }
      } else if (inputType === "query") {
        if (queryIndex >= 0 && filteredSearch.length > 0) {
          const selectedQuery = filteredSearch[queryIndex];
          setSearchQuery(selectedQuery);
          setConfirmedSearchQuery(selectedQuery);
          setShowSearchDropdown(false);
          setQueryIndex(-1);
        } else {
          setConfirmedSearchQuery(searchQuery);
          setShowSearchDropdown(false);
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (inputType === "location" && filteredLocations.length > 0) {
        setLocationIndex((prev) => (prev + 1) % filteredLocations.length);
        setShowLocationDropdown(true);
      } else if (inputType === "query" && filteredSearch.length > 0) {
        setQueryIndex((prev) => (prev + 1) % filteredSearch.length);
        setShowSearchDropdown(true);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (inputType === "location" && filteredLocations.length > 0) {
        setLocationIndex(
          (prev) =>
            (prev - 1 + filteredLocations.length) % filteredLocations.length
        );
        setShowLocationDropdown(true);
      } else if (inputType === "query" && filteredSearch.length > 0) {
        setQueryIndex(
          (prev) => (prev - 1 + filteredSearch.length) % filteredSearch.length
        );
        setShowSearchDropdown(true);
      }
    } else if (e.key === "Escape") {
      if (inputType === "location") {
        setShowLocationDropdown(false);
        setLocationIndex(-1);
      } else if (inputType === "query") {
        setShowSearchDropdown(false);
        setQueryIndex(-1);
      }
    }
  };

  const handleSelect = (value: string, inputType: string) => {
    if (inputType === "location") {
      setLocation(value);
      setConfirmedLocation(value);
      setShowLocationDropdown(false);
      setLocationIndex(-1);
    } else if (inputType === "query") {
      setSearchQuery(value);
      setConfirmedSearchQuery(value);
      setShowSearchDropdown(false);
      setQueryIndex(-1);
    }
  };

  const handleFocus = (inputType: string) => {
    if (inputType === "location" && filteredLocations.length > 0) {
      setShowLocationDropdown(true);
    } else if (inputType === "query" && filteredSearch.length > 0) {
      setShowSearchDropdown(true);
    }
  };

  const isValidLocation = locations.some(
    (loc) => loc.toLowerCase() === location.toLowerCase().trim()
  );

  const isValidSearchQuery = searchSuggestions.some(
    (item) => item.toLowerCase() === searchQuery.toLowerCase().trim()
  );

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      const params = new URLSearchParams();

      if (confirmedLocation) params.append("location", confirmedLocation);
      if (confirmedSearchQuery)
        params.append("searchQuery", confirmedSearchQuery);
      if (genderFilter) params.append("gender", genderFilter);
      if (patientStoriesFilter > 0)
        params.append("minPatientStories", String(patientStoriesFilter));
      if (experienceFilter > 0)
        params.append("minExperience", String(experienceFilter));
      if (sortBy) params.append("sortBy", sortBy);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/doctors?${params.toString()}`
        );        
        if (!res.ok) throw new Error("Failed to fetch");
        const data: Doctor[] = await res.json();

        let filteredData = data;

        if (confirmedLocation.trim()) {
          filteredData = filteredData.filter((doctor) =>
            doctor.location
              .toLowerCase()
              .includes(confirmedLocation.toLowerCase().trim())
          );
        }

        if (confirmedSearchQuery.trim()) {
          filteredData = filteredData.filter(
            (doctor) =>
              doctor.specialty
                .toLowerCase()
                .includes(confirmedSearchQuery.toLowerCase().trim()) ||
              doctor.name
                .toLowerCase()
                .includes(confirmedSearchQuery.toLowerCase().trim())
          );
        }

        setDoctors(filteredData);
      } catch (e) {
        console.error(e);
        setDoctors([]);
      }
      setLoading(false);
    };

    if (confirmedLocation.trim() || confirmedSearchQuery.trim()) {
      fetchDoctors();
    } else {
      setDoctors([]);
      setLoading(false);
    }
  }, [
    confirmedLocation,
    confirmedSearchQuery,
    genderFilter,
    patientStoriesFilter,
    experienceFilter,
    sortBy,
  ]);

  // Handle booking appointment
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      alert("Please select a date and time.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          date: appointmentDate,
          time: appointmentTime,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Appointment booked successfully!");
        setShowAppointmentModal(false);
        setAppointmentDate("");
        setAppointmentTime("");
        setSelectedDoctor(null);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Error booking appointment");
    }
  };

  return (
    <>
      {/* Appointment Modal */}
      {showAppointmentModal && selectedDoctor && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Book Appointment with {selectedDoctor.name}
            </h2>
            <div className="mb-4">
              <label className="block text-sm mb-1">Date</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
                min={new Date().toISOString().split("T")[0]} // No past dates
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Time</label>
              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
                min="09:00"
                max="18:00"
                step="1800" // 30-minute intervals
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => {
                  setShowAppointmentModal(false);
                  setAppointmentDate("");
                  setAppointmentTime("");
                  setSelectedDoctor(null);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleBookAppointment}
              >
                Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Filters */}
      <div className="flex flex-col items-center gap-2 w-full max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row w-full border border-gray-300 rounded overflow-hidden">
          <div className="relative flex-1" ref={locationRef}>
            <input
              type="text"
              placeholder="Location"
              className="w-full px-4 py-2 border-b sm:border-b-0 sm:border-r border-gray-300 focus:outline-none text-black"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "location")}
              onFocus={() => handleFocus("location")}
              autoComplete="off"
            />
            {showLocationDropdown && filteredLocations.length > 0 && (
              <ul className="absolute left-0 top-full mt-1 bg-white border border-gray-300 w-full max-h-40 overflow-auto text-left text-gray-800 text-sm shadow-lg z-[1000]">
                {filteredLocations.map((loc, index) => (
                  <li
                    key={loc}
                    className={`cursor-pointer px-3 py-2 hover:bg-gray-200 ${
                      index === locationIndex ? "bg-blue-200" : ""
                    }`}
                    onMouseDown={() => handleSelect(loc, "location")}
                    onMouseEnter={() => setLocationIndex(index)}
                  >
                    {loc}
                  </li>
                ))}
              </ul>
            )}
            {location.trim() !== "" &&
              !isValidLocation &&
              filteredLocations.length === 0 &&
              !showLocationDropdown && (
                <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 w-full text-gray-500 text-sm p-2 z-[1000]">
                  No matching locations. Press Enter to search anyway.
                </div>
              )}
          </div>
          <div className="relative flex-1" ref={queryRef}>
            <input
              type="text"
              placeholder="Search doctors, specialties..."
              className="w-full px-4 py-2 focus:outline-none text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "query")}
              onFocus={() => handleFocus("query")}
              autoComplete="off"
            />
            {showSearchDropdown && filteredSearch.length > 0 && (
              <ul className="absolute left-0 top-full mt-1 bg-white border border-gray-300 w-full max-h-40 overflow-auto text-left text-gray-800 text-sm shadow-lg z-[1000]">
                {filteredSearch.map((item, index) => (
                  <li
                    key={item}
                    className={`cursor-pointer px-3 py-2 hover:bg-gray-200 ${
                      index === queryIndex ? "bg-blue-200" : ""
                    }`}
                    onMouseDown={() => handleSelect(item, "query")}
                    onMouseEnter={() => setQueryIndex(index)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {searchQuery.trim() !== "" &&
              !isValidSearchQuery &&
              filteredSearch.length === 0 &&
              !showSearchDropdown && (
                <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 w-full text-gray-500 text-sm p-2 z-[1000]">
                  No matching suggestions. Press Enter to search anyway.
                </div>
              )}
          </div>
        </div>
        <div className="bg-[#1d2a8cfe] flex flex-wrap w-screen gap-3 mt-1 justify-center p-2 relative">
          <select
            value={genderFilter}
            onChange={(e) =>
              setGenderFilter(e.target.value as "male" | "female" | "")
            }
            className="w-32 h-8 bg-[#417bc647] text-white text-[14px] px-4 py-2"
          >
            <option value="">Gender</option>
            <option value="male">Male Doctor</option>
            <option value="female">Female Doctor</option>
          </select>
          <select
            value={patientStoriesFilter === 0 ? "" : patientStoriesFilter}
            onChange={(e) =>
              setPatientStoriesFilter(
                e.target.value === "" ? 0 : Number(e.target.value)
              )
            }
            className="w-36 bg-[#417bc647] text-white text-xs px-4 py-2"
          >
            <option value="">Patient Stories</option>
            <option value="10">10+ Patient Stories</option>
            <option value="60">60+ Patient Stories</option>
            <option value="210">210+ Patient Stories</option>
          </select>
          <select
            value={experienceFilter === 0 ? "" : experienceFilter}
            onChange={(e) =>
              setExperienceFilter(
                e.target.value === "" ? 0 : Number(e.target.value)
              )
            }
            className="w-36 bg-[#417bc647] text-white text-xs px-4 py-2"
          >
            <option value="">Experience</option>
            <option value="5">5+ Years</option>
            <option value="10">10+ Years</option>
            <option value="15">15+ Years</option>
            <option value="20">20+ Years</option>
          </select>
          <div className="relative">
            <button
              onClick={() => setShowAllFiltersDropdown((prev) => !prev)}
              className="w-36 text-white text-xs px-4 py-2"
            >
              All Filters ▼
            </button>
            {showAllFiltersDropdown && (
              <div className="absolute z-50 mt-2 w-64 bg-[#1d2a8cfe] text-white p-4 rounded shadow-lg text-sm space-y-4">
                <div>
                  <p className="font-medium mb-1">Associated with</p>
                  {[
                    "Manipal Hospitals",
                    "Apollo Cradle",
                    "Rainbow Hospitals",
                    "Apollo Clinic",
                    "Cloudnine Hospitals",
                    "Motherhood Group",
                  ].map((hospital) => (
                    <label key={hospital} className="block">
                      <input type="checkbox" className="mr-2" /> {hospital}
                    </label>
                  ))}
                </div>
                <div>
                  <p className="font-medium mb-1">Fees</p>
                  {["₹0-₹500", "Above ₹500", "Above ₹1000", "Above ₹2000"].map(
                    (fee) => (
                      <label key={fee} className="block">
                        <input type="radio" name="fees" className="mr-2" /> {fee}
                      </label>
                    )
                  )}
                </div>
                <div>
                  <p className="font-medium mb-1">Availability</p>
                  {[
                    "Available in next 4 hours",
                    "Available Today",
                    "Available Tomorrow",
                    "Available in next 7 days",
                  ].map((time) => (
                    <label key={time}>
                      <input
                        type="radio"
                        name="availability"
                        className="mr-2"
                      />{" "}
                      {time}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-white text-xs">
            <label htmlFor="sortBy">Sort By:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-36 bg-[#417bc647] px-4 py-2"
            >
              <option value="relevance">Relevance</option>
              <option value="experience">Experience</option>
              <option value="rating">Rating</option>
              <option value="fees">Fees</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Status */}
      <div className="w-[640px] ml-14 mt-4">
        <div className="font-semibold text-[18px]">
          {doctors.length > 0 && (location || searchQuery) && (
            <p className="text-black">
              <span>{doctors.length}</span>{" "}
              {searchQuery ? (
                <span className="capitalize">{searchQuery}</span>
              ) : (
                "Doctors"
              )}{" "}
              available
              {location && (
                <>
                  {" "}
                  in <span className="capitalize">{location}</span>
                </>
              )}
            </p>
          )}
        </div>
        <div className="text-xs mt-2 flex items-start gap-2 text-gray-700">
          <div>
            <svg
              className="h-4 w-4 mt-[2px]"
              viewBox="-0.5 0 25 25"
              fill="#dddddd"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.2467 22 21.5 17.7467 21.5 12.5C21.5 7.25329 17.2467 3 12 3C6.75329 3 2.5 7.25329 2.5 12.5C2.5 17.7467 6.75329 22 12 22Z"
                stroke="#0F0F0F"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.68 9.13L9.39001 17.42L6.76001 14.79"
                stroke="#0F0F0F"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p>
            Book appointments with minimum wait-time & verified doctor details
          </p>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="w-[640px] ml-8 mb-6">
        {loading && <p>Loading doctors...</p>}
        {!loading &&
          doctors.length === 0 &&
          (confirmedLocation || confirmedSearchQuery) && (
            <p>No doctors found for your search criteria.</p>
          )}
        {!loading &&
          doctors.length === 0 &&
          !confirmedLocation &&
          !confirmedSearchQuery && (
            <p>Enter a location or specialty to search for doctors.</p>
          )}
        {!loading && doctors.length > 0 && (
          <hr className="mt-8 ml-4 border-t border-gray-300" />
        )}
        {Array.isArray(doctors) &&
          doctors.map((doc, index) => (
            <React.Fragment key={doc.id}>
              {index !== 0 && <hr className="my-4 border-t border-gray-300" />}
              <div className="p-3">
                <div className="flex gap-3 items-start">
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    className="w-30 h-30 object-cover rounded-full"
                  />
                  <div className="w-[360px]">
                    <h2 className="text-lg text-blue-500">{doc.name}</h2>
                    <p className="text-gray-600 text-[12px] mb-0.5 mt-1">
                      {doc.specialty}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {doc.experience} years experience
                    </p>
                    <span className="mt-1 text-xs text-gray-600 flex items-center gap-2">
                      <span className="font-bold">{doc.location}</span>
                      <ul className="list-disc ml-4">
                        <li>{doc.clinicName}</li>
                      </ul>
                    </span>
                    <p className="text-xs mt-1">₹{doc.fees} Consultation Fees</p>
                    <hr className="my-2 w-full border-dashed border-gray-200" />
                    <div className="flex items-center gap-2 mt-1">
                      {doc.rating > 0 ? (
                        <button className="flex items-center gap-1 bg-green-600 text-white text-[10px] px-2 py-[2px] rounded">
                          <svg
                            className="w-2.5 h-2.5 fill-white"
                            viewBox="0 0 512 512"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M80,186H20c-11.046,0-20,8.954-20,20v250c0,11.046,8.954,20,20,20h60c11.046,0,20-8.954,20-20V206 C100,194.954,91.046,186,80,186z" />
                            <path d="M337.137,186c-15.4,0-25.247-16.411-18-30l36.434-68.313C368.057,64.275,351.092,36,324.559,36h0 c-9.322,0-18.261,3.703-24.853,10.294L183.431,162.569C168.429,177.572,160,197.92,160,219.137V396c0,44.183,35.817,80,80,80 h165.644c27.304,0,51.165-18.435,58.057-44.855l46.577-178.544c1.143-4.383,1.722-8.894,1.722-13.423v0 C512,209.809,488.191,186,458.822,186H337.137z" />
                          </svg>
                          {Math.round(doc.rating * 20)}%
                        </button>
                      ) : (
                        <button className="bg-green-800 text-white text-[10px] px-2 py-[2px] rounded-full">
                          New
                        </button>
                      )}
                      <span className="text-[12px] text-gray-600 underline font-bold">
                        {doc.patientStories} patient stories
                      </span>
                    </div>
                  </div>
                  <div className="w-36 flex flex-col gap-2 mt-[12vh]">
                    <div className="text-xs flex justify-center text-green-600 font-semibold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-1 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {doc.availableToday && "Available Today"}
                    </div>
                    <button
                      className="bg-blue-500 text-xs text-white rounded px-2 py-2"
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setShowAppointmentModal(true);
                      }}
                    >
                      Book Clinic Visit
                    </button>
                    {doc.contactNumber && (
                      <a
                        href={`tel:${doc.contactNumber}`}
                        className="bg-white border border-gray-300 text-xs text-blue-500 px-2 py-2 text-center flex justify-center gap-1.5 rounded"
                      >
                        <svg
                          className="w-4 h-4 fill-blue-500"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M21,15v3.93a2,2,0,0,1-2.29,2A18,18,0,0,1,3.14,5.29,2,2,0,0,1,5.13,3H9a1,1,0,0,1,1,.89,10.74,10.74,0,0,0,1,3.78,1,1,0,0,1-.42,1.26l-.86.49a1,1,0,0,0-.33,1.46,14.08,14.08,0,0,0,3.69,3.69,1,1,0,0,0,1.46-.33l-.86A1,1,0,0,1,16.33,13a10.74,10.74,0,0,0,3.78,1A1,1,0,0,1,21,15Z" />
                        </svg>
                        Contact Clinic
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
      </div>
    </>
  );
}
