import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Profile = () => {
    const user = useSelector((store) => store.user);
    const { isAuthChecking } = useOutletContext();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isEditMode = location.pathname === '/profile/edit';
    
    const [isEditing, setIsEditing] = useState(isEditMode);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        emailId: '',
        age: '',
        gender: '',
        about: '',
        skills: '',
        title: '',
        location: '',
        website: '',
        github: '',
        linkedin: ''
    });

    // Update isEditing when route changes
    useEffect(() => {
        setIsEditing(isEditMode);
    }, [isEditMode]);

    useEffect(() => {
        if (isAuthChecking) return;
        
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                emailId: user.emailId || '',
                age: user.age || '',
                gender: user.gender || '',
                about: user.about || '',
                skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || ''),
                title: user.title || '',
                location: user.location || '',
                website: user.website || '',
                github: user.github || '',
                linkedin: user.linkedin || ''
            });
        } else {
            navigate('/login');
        }
    }, [user, navigate, isAuthChecking]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        setUploadingPhoto(true);
        setError('');
        setSuccess('');

        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload to server
            const formData = new FormData();
            formData.append('photo', file);

            const res = await axios.post(`${BASE_URL}/profile/upload-photo`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update user data in Redux
            dispatch(addUser(res.data.data));
            setSuccess('Profile photo updated successfully!');
            // Clear preview immediately after upload succeeds
            setPhotoPreview(null);
        } catch (err) {
            console.error('Error uploading photo:', err);
            const errorMessage = err.response?.data?.message || 'Failed to upload photo';
            setError(errorMessage);
            setPhotoPreview(null);
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // Only send fields that the backend accepts
            const allowedFields = ['firstName', 'lastName', 'emailId', 'photoUrl', 'about', 'gender', 'age', 'skills', 'title', 'location', 'website', 'github', 'linkedin'];
            const dataToSend = {};
            allowedFields.forEach(field => {
                if (formData[field] !== undefined && formData[field] !== '') {
                    dataToSend[field] = formData[field];
                }
            });

            const res = await axios.patch(`${BASE_URL}/profile/edit`, dataToSend, {
                withCredentials: true
            });
            
            dispatch(addUser(res.data.data));
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            
            // Navigate to profile view after save
            if (isEditMode) {
                navigate('/profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            console.error('Error response:', err.response?.data);
            const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to update profile';
            setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError('');
        setSuccess('');
        setPhotoPreview(null);
        
        // Reset form data to original user data
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                emailId: user.emailId || '',
                age: user.age || '',
                gender: user.gender || '',
                about: user.about || '',
                skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || ''),
                title: user.title || '',
                location: user.location || '',
                website: user.website || '',
                github: user.github || '',
                linkedin: user.linkedin || ''
            });
        }
        
        if (isEditMode) {
            navigate('/profile');
        }
    };

    if (isAuthChecking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-900 dark:text-white text-lg">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Please log in</h2>
                    <p className="text-gray-600 dark:text-gray-300">You need to be logged in to view your profile</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20 pb-8">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -right-32 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-5 blur-3xl"></div>
                <div className="absolute top-0 -left-32 w-80 h-80 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-5 blur-3xl"></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-professional-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8 animate-bounce-in">
                    {/* Cover Section */}
                    <div className="relative">
                        <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500"></div>
                        
                        {/* Profile Picture */}
                        <div className="absolute -bottom-16 left-8">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1 shadow-xl">
                                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden relative group">
                                    {photoPreview ? (
                                        <img 
                                            src={photoPreview} 
                                            alt={user.firstName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : user.photoUrl ? (
                                        <img 
                                            src={user.photoUrl} 
                                            alt={user.firstName}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                const initials = document.createElement('span');
                                                initials.className = 'text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent';
                                                initials.textContent = `${(user.firstName?.[0] || 'U').toUpperCase()}${(user.lastName?.[0] || 'N').toUpperCase()}`;
                                                e.target.parentElement.appendChild(initials);
                                            }}
                                        />
                                    ) : (
                                        <span className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                            {(user.firstName?.[0] || 'U').toUpperCase()}{(user.lastName?.[0] || 'N').toUpperCase()}
                                        </span>
                                    )}
                                    {isEditing && (
                                        <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handlePhotoUpload}
                                                className="hidden"
                                                disabled={uploadingPhoto}
                                            />
                                            {uploadingPhoto ? (
                                                <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        {!isEditing && (
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 btn-bounce"
                                >
                                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span className="text-gray-600 dark:text-gray-300 font-medium">Edit Profile</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="pt-20 pb-8 px-8">
                        {isEditing ? (
                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Error/Success Messages */}
                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                    </div>
                                )}
                                {success && (
                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                        <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                                    </div>
                                )}

                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="input-professional w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="input-professional w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="emailId"
                                            value={formData.emailId}
                                            onChange={handleInputChange}
                                            className="input-professional w-full"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Job Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="input-professional w-full"
                                            placeholder="e.g., Full Stack Developer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            className="input-professional w-full"
                                            min="18"
                                            max="100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="input-professional w-full"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="input-professional w-full"
                                            placeholder="e.g., San Francisco, CA"
                                        />
                                    </div>
                                </div>

                                {/* About */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                        About
                                    </label>
                                    <textarea
                                        name="about"
                                        value={formData.about}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="input-professional w-full resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                {/* Skills */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                        Skills (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleInputChange}
                                        className="input-professional w-full"
                                        placeholder="e.g., JavaScript, React, Node.js, Python"
                                    />
                                </div>

                                {/* Social Links */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            className="input-professional w-full"
                                            placeholder="https://yourwebsite.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            GitHub
                                        </label>
                                        <input
                                            type="text"
                                            name="github"
                                            value={formData.github}
                                            onChange={handleInputChange}
                                            className="input-professional w-full"
                                            placeholder="github.com/username"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            LinkedIn
                                        </label>
                                        <input
                                            type="text"
                                            name="linkedin"
                                            value={formData.linkedin}
                                            onChange={handleInputChange}
                                            className="input-professional w-full"
                                            placeholder="linkedin.com/in/username"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-4 pt-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed btn-bounce shadow-lg"
                                    >
                                        {isLoading ? (
                                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-all duration-200 btn-bounce"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span>Cancel</span>
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                {/* Name and Title */}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {user.firstName} {user.lastName}
                                    </h1>
                                    <p className="text-xl text-blue-600 dark:text-blue-400 font-medium mb-2">
                                        {user.title || 'Software Developer'}
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300">
                                        {user.age && (
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {user.age} years old
                                            </span>
                                        )}
                                        {user.gender && (
                                            <span className="flex items-center capitalize">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                {user.gender}
                                            </span>
                                        )}
                                        {user.location && (
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {user.location}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* About */}
                                {user.about && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About</h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {user.about}
                                        </p>
                                    </div>
                                )}

                                {/* Skills */}
                                {user.skills && user.skills.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {(Array.isArray(user.skills) 
                                                ? user.skills 
                                                : user.skills.split(',')
                                            ).filter(skill => skill && (typeof skill === 'string' ? skill.trim() : skill)).map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-700"
                                                >
                                                    {typeof skill === 'string' ? skill.trim() : skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Contact & Social */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                            <span className="text-gray-600 dark:text-gray-300">{user.emailId}</span>
                                        </div>
                                        
                                        {user.website && (
                                            <div className="flex items-center space-x-3">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                                </svg>
                                                <a
                                                    href={user.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    {user.website}
                                                </a>
                                            </div>
                                        )}
                                        
                                        {user.github && (
                                            <div className="flex items-center space-x-3">
                                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                </svg>
                                                <a
                                                    href={`https://${user.github}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    {user.github}
                                                </a>
                                            </div>
                                        )}
                                        
                                        {user.linkedin && (
                                            <div className="flex items-center space-x-3">
                                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                </svg>
                                                <a
                                                    href={`https://${user.linkedin}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    {user.linkedin}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
