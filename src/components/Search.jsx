import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const Search = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [location, setLocation] = useState('');
    const [minExperience, setMinExperience] = useState('');
    const [maxExperience, setMaxExperience] = useState('');
    const [availability, setAvailability] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalResults, setTotalResults] = useState(0);
    const [skillSuggestions, setSkillSuggestions] = useState([]);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
    const [skillInput, setSkillInput] = useState('');

    // Fetch suggestions on component mount
    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const [skillsRes, locationsRes] = await Promise.all([
                axios.get(`${BASE_URL}/search/suggestions?type=skills`, { withCredentials: true }),
                axios.get(`${BASE_URL}/search/suggestions?type=locations`, { withCredentials: true })
            ]);

            if (skillsRes.data.success) {
                setSkillSuggestions(skillsRes.data.data);
            }
            if (locationsRes.data.success) {
                setLocationSuggestions(locationsRes.data.data);
            }
        } catch (err) {
            console.error('Error fetching suggestions:', err);
        }
    };

    const handleSearch = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            
            if (searchText.trim()) params.append('searchText', searchText.trim());
            if (selectedSkills.length > 0) params.append('skills', selectedSkills.join(','));
            if (location.trim()) params.append('location', location.trim());
            if (minExperience) params.append('minExperience', minExperience);
            if (maxExperience) params.append('maxExperience', maxExperience);
            if (availability) params.append('availability', availability);
            params.append('page', page);
            params.append('limit', 20);

            const response = await axios.get(
                `${BASE_URL}/search?${params.toString()}`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setResults(response.data.data);
                setCurrentPage(response.data.pagination.currentPage);
                setTotalPages(response.data.pagination.totalPages);
                setTotalResults(response.data.pagination.totalResults);
            }
        } catch (err) {
            console.error('Search error:', err);
            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    }, [searchText, selectedSkills, location, minExperience, maxExperience, availability, navigate]);

    const handleAddSkill = (skill) => {
        if (skill && !selectedSkills.includes(skill)) {
            setSelectedSkills([...selectedSkills, skill]);
            setSkillInput('');
            setShowSkillSuggestions(false);
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
    };

    const handleClearFilters = () => {
        setSearchText('');
        setSelectedSkills([]);
        setLocation('');
        setMinExperience('');
        setMaxExperience('');
        setAvailability('');
        setResults([]);
        setCurrentPage(1);
        setTotalPages(0);
        setTotalResults(0);
    };

    const handleSendRequest = async (userId) => {
        try {
            await axios.post(
                `${BASE_URL}/request/send/interested/${userId}`,
                {},
                { withCredentials: true }
            );
            // Refresh search results to update connection status
            handleSearch(currentPage);
        } catch (err) {
            console.error('Error sending request:', err);
        }
    };

    const filteredSkillSuggestions = skillSuggestions.filter(
        skill => skill.toLowerCase().includes(skillInput.toLowerCase()) && !selectedSkills.includes(skill)
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Two Column Layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Sidebar - Search Filters */}
                    <div className="lg:w-80 xl:w-96 flex-shrink-0">
                        <div className="sticky top-4">
                            {/* Header */}
                            <div className="mb-4">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    Search Developers
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Find developers by skills, location, experience, and availability
                                </p>
                            </div>

                            {/* Search Filters Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                                {/* Text Search */}
                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Search by Name or About
                                    </label>
                                    <input
                                        type="text"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        placeholder="e.g., John Doe"
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Skills Filter */}
                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Skills
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => {
                                                setSkillInput(e.target.value);
                                                setShowSkillSuggestions(true);
                                            }}
                                            onFocus={() => setShowSkillSuggestions(true)}
                                            placeholder="Type to add skills..."
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && skillInput.trim()) {
                                                    handleAddSkill(skillInput.trim());
                                                }
                                            }}
                                        />
                                        {showSkillSuggestions && skillInput && filteredSkillSuggestions.length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                                {filteredSkillSuggestions.slice(0, 10).map((skill) => (
                                                    <button
                                                        key={skill}
                                                        onClick={() => handleAddSkill(skill)}
                                                        className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                                                    >
                                                        {skill}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {/* Selected Skills */}
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {selectedSkills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                                            >
                                                {skill}
                                                <button
                                                    onClick={() => handleRemoveSkill(skill)}
                                                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Location Filter */}
                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        list="location-suggestions"
                                        placeholder="e.g., San Francisco, Remote"
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <datalist id="location-suggestions">
                                        {locationSuggestions.map((loc) => (
                                            <option key={loc} value={loc} />
                                        ))}
                                    </datalist>
                                </div>

                                {/* Experience Range */}
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Min Exp (yrs)
                                        </label>
                                        <input
                                            type="number"
                                            value={minExperience}
                                            onChange={(e) => setMinExperience(e.target.value)}
                                            min="0"
                                            max="50"
                                            placeholder="0"
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Max Exp (yrs)
                                        </label>
                                        <input
                                            type="number"
                                            value={maxExperience}
                                            onChange={(e) => setMaxExperience(e.target.value)}
                                            min="0"
                                            max="50"
                                            placeholder="50"
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Availability Filter */}
                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Availability
                                    </label>
                                    <select
                                        value={availability}
                                        onChange={(e) => setAvailability(e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All</option>
                                        <option value="available">Available</option>
                                        <option value="busy">Busy</option>
                                        <option value="not-looking">Not Looking</option>
                                    </select>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSearch(1)}
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {isLoading ? 'Searching...' : 'Search'}
                                    </button>
                                    <button
                                        onClick={handleClearFilters}
                                        className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subtle Vertical Divider */}
                    <div className="hidden lg:block w-px bg-gray-200 dark:bg-white/10 rounded-full"></div>

                    {/* Right Side - Search Results */}
                    <div className="flex-1 min-w-0">
                        {/* Results Header + Count */}
                        <div className="flex items-baseline justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Results</h2>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {totalResults > 0
                                    ? `Found ${totalResults} developer${totalResults !== 1 ? 's' : ''}`
                                    : 'No results'}
                            </span>
                        </div>

                        {/* Search Results Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {results.map((user) => (
                                <div
                                    key={user._id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm"
                                >
                                    {/* User Avatar & Name */}
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-base">
                                            {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="ml-3 flex-1 min-w-0">
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                                {user.firstName} {user.lastName}
                                            </h3>
                                            {user.title && (
                                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                    {user.title}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Location & Experience */}
                                    <div className="mb-3 space-y-1.5">
                                        {user.location && (
                                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                                <svg className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="truncate">{user.location}</span>
                                            </div>
                                        )}
                                        {user.experience !== undefined && user.experience !== null && (
                                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                                <svg className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {user.experience} years
                                            </div>
                                        )}
                                        {user.availability && (
                                            <div className="flex items-center text-xs">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    user.availability === 'available' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                                                    user.availability === 'busy' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                                }`}>
                                                    {user.availability.charAt(0).toUpperCase() + user.availability.slice(1)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* About */}
                                    {user.about && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                            {user.about}
                                        </p>
                                    )}

                                    {/* Skills */}
                                    {user.skills && user.skills.length > 0 && (
                                        <div className="mb-3">
                                            <div className="flex flex-wrap gap-1">
                                                {user.skills.slice(0, 4).map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {user.skills.length > 4 && (
                                                    <span className="px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400">
                                                        +{user.skills.length - 4}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <div className="mt-3">
                                        {user.isConnected ? (
                                            <button
                                                disabled
                                                className="w-full px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg font-medium cursor-not-allowed"
                                            >
                                                Connected
                                            </button>
                                        ) : user.connectionStatus === 'interested' ? (
                                            <button
                                                disabled
                                                className="w-full px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed"
                                            >
                                                Request Sent
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleSendRequest(user._id)}
                                                className="w-full px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                            >
                                                Connect
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* No Results */}
                        {!isLoading && results.length === 0 && totalResults === 0 && (searchText || selectedSkills.length > 0 || location || minExperience || maxExperience || availability) && (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No results found
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Try adjusting your search filters
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-6">
                                <button
                                    onClick={() => handleSearch(currentPage - 1)}
                                    disabled={currentPage === 1 || isLoading}
                                    className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handleSearch(currentPage + 1)}
                                    disabled={currentPage === totalPages || isLoading}
                                    className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
