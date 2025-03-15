// Statistics.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase-config'; // Adjust path as needed
import { collection, getDocs } from 'firebase/firestore';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
    BarChart, Bar
} from 'recharts';
import './Statistics.css'; // Import the CSS

const Statistics = () => {
    const [userTypeDistribution, setUserTypeDistribution] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imagesPerDay, setImagesPerDay] = useState([]);
    const [experiencesPerDay, setExperiencesPerDay] = useState([]);
    const [incluidosUsage, setIncluidosUsage] = useState([]);
    const [activityTypeUsage, setActivityTypeUsage] = useState([]);


    // Colors for the pie chart slices.  Expand this if you have more user types.
     const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];


    useEffect(() => {
        // ... (Your existing data fetching code - NO CHANGES HERE) ...
        const fetchUserTypeData = async () => {
            try {
                const usersCollection = collection(db, 'lista-de-usuarios');
                const querySnapshot = await getDocs(usersCollection);

                const userTypeCounts = {};

                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    const userType = userData.userType;

                    if (userType) {
                        if (userTypeCounts[userType]) {
                            userTypeCounts[userType]++;
                        } else {
                            userTypeCounts[userType] = 1;
                        }
                    } else {
                        console.warn(`User with ID ${doc.id} has no userType`);
                    }
                });

                const userTypeData = Object.entries(userTypeCounts).map(([userType, count]) => ({
                    name: userType,
                    value: count
                }));
                setUserTypeDistribution(userTypeData);
            } catch (err) {
                console.error("Error fetching user type data:", err);
                setError("Failed to load user type statistics.");
            } finally {
                setLoading(false);
            }
        };

        const fetchImageUploadData = async () => {
           try {
                const galleryCollection = collection(db, 'Galeria de Imágenes');
                const querySnapshot = await getDocs(galleryCollection);

                let allImages = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.images && Array.isArray(data.images)) {
                        allImages = allImages.concat(data.images);
                    }
                });

                // Create a map to count images per day
                const imagesPerDayMap = {};
                allImages.forEach(image => {
                    // Extract the date part (YYYY/MM/DD) from the uploadDate string.
                    const datePart = image.uploadDate.split('/').slice(0,3).join('/'); // Important:  Keep consistent format.

                    if (imagesPerDayMap[datePart]) {
                        imagesPerDayMap[datePart]++;
                    } else {
                        imagesPerDayMap[datePart] = 1;
                    }
                });

                // Convert the map to an array of objects for Recharts
                const imagesPerDayData = Object.entries(imagesPerDayMap).map(([date, count]) => ({
                    date,
                    count
                }));

                // Sort the data by date (most recent first)
                imagesPerDayData.sort((a, b) => {
                    const [dayA, monthA, yearA] = a.date.split('/');
                    const [dayB, monthB, yearB] = b.date.split('/');
                    const dateA = new Date(yearA, monthA - 1, dayA);
                    const dateB = new Date(yearB, monthB - 1, dayB);
                    return dateB - dateA; // Descending order
                });
                setImagesPerDay(imagesPerDayData);


            } catch (err) {
                console.error("Error fetching image upload data:", err);
                setError("Failed to load image upload statistics.");
            } finally {
                setLoading(false);
            }
        };


        const fetchExperienceData = async () => {
            try {
                const experiencesCollection = collection(db, 'Experiencias');
                const querySnapshot = await getDocs(experiencesCollection);

                const experiencesPerDayMap = {};
                const incluidosCount = {};
                const activityTypeCount = {};


                querySnapshot.forEach((doc) => {
                    const experienceData = doc.data();

                   //Experiences per day.  Extract creation date.
                   const creationTimestamp = doc.metadata.creationTime; // Use built-in metadata.
                    if (creationTimestamp) { // Check for valid timestamp

                        const creationDate = new Date(creationTimestamp);

                        const year = creationDate.getFullYear();
                        const month = String(creationDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                        const day = String(creationDate.getDate()).padStart(2, '0');
                        const dateStr = `${day}/${month}/${year}`;


                        if (experiencesPerDayMap[dateStr]) {
                            experiencesPerDayMap[dateStr]++;
                        } else {
                            experiencesPerDayMap[dateStr] = 1;
                        }
                    }


                    // Incluidos usage
                    if (Array.isArray(experienceData.incluidosExperiencia)) {
                        experienceData.incluidosExperiencia.forEach(incluido => {
                            if (incluidosCount[incluido]) {
                                incluidosCount[incluido]++;
                            } else {
                                incluidosCount[incluido] = 1;
                            }
                        });
                    }

                    // Activity type usage
                    if (experienceData.tipoActividad) {
                        if (activityTypeCount[experienceData.tipoActividad]) {
                            activityTypeCount[experienceData.tipoActividad]++;
                        } else {
                            activityTypeCount[experienceData.tipoActividad] = 1;
                        }
                    }
                });

                const experiencesPerDayData = Object.entries(experiencesPerDayMap).map(([date, count]) => ({
                    date,
                    count
                }));
                //Sort in descending order
                 experiencesPerDayData.sort((a, b) => {
                    const [dayA, monthA, yearA] = a.date.split('/');
                    const [dayB, monthB, yearB] = b.date.split('/');
                    const dateA = new Date(yearA, monthA - 1, dayA);
                    const dateB = new Date(yearB, monthB - 1, dayB);
                    return dateB - dateA;
                });

                const incluidosUsageData = Object.entries(incluidosCount).map(([incluido, count]) => ({
                    name: incluido,
                    value: count
                }));
                 incluidosUsageData.sort((a,b) => b.value - a.value);


                const activityTypeUsageData = Object.entries(activityTypeCount).map(([activityType, count]) => ({
                    name: activityType,
                    value: count
                }));
                activityTypeUsageData.sort((a, b) => b.value - a.value);

                setExperiencesPerDay(experiencesPerDayData);
                setIncluidosUsage(incluidosUsageData);
                setActivityTypeUsage(activityTypeUsageData);

            } catch (err) {
                console.error("Error fetching experience data:", err);
                setError("Failed to load experience statistics.");
            } finally {
                setLoading(false);
            }
        };


        fetchUserTypeData();
        fetchImageUploadData();
        fetchExperienceData(); // Fetch the new data
    }, []);

    if (loading) {
        return (
            <div className="flex-statistics justify-center-statistics items-center-statistics h-screen-statistics">
                <div className="animate-spin-statistics rounded-full-statistics h-16-statistics w-16-statistics border-t-2-statistics border-b-2-statistics border-blue-500-statistics"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-statistics justify-center-statistics items-center-statistics h-screen-statistics">
                <div className="bg-red-100-statistics border-statistics border-red-400-statistics text-red-700-statistics px-4-statistics py-3-statistics rounded-statistics relative-statistics" role="alert">
                    <strong className="font-bold-statistics">Error:</strong>
                    <span className="block-statistics sm:inline-statistics">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-statistics mx-auto-statistics px-4-statistics py-8-statistics">
            <h1 className="text-3xl-statistics font-bold-statistics text-center-statistics mb-8-statistics text-gray-800-statistics">Estadísticas</h1>

            {/* User Type Distribution (Pie Chart) */}
            <div className="bg-white-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics mb-8-statistics">
                <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">Tipos de Usuarios Registrados</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={userTypeDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(2)}%`}
                        >
                            {userTypeDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip  className="chart-tooltip-statistics" />
                        <Legend  className="chart-legend-text-statistics"/>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Images Uploaded per Day (Bar Chart) */}
            <div className="bg-white-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics mb-8-statistics">
                <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">Images Uploaded per Day</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={imagesPerDay} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        {/* Apply CSS classes and props for styling */}
                        <CartesianGrid strokeDasharray="3 3"  className="chart-grid-lines-statistics" />
                        <XAxis dataKey="date"  className="chart-axis-text-statistics" />
                        <YAxis  className="chart-axis-text-statistics" />
                        <Tooltip className="chart-tooltip-statistics" />
                         <Legend  className="chart-legend-text-statistics"/>
                        <Bar dataKey="count" fill="#8884d8" name="Images Uploaded" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Experiences Created per Day (Line Chart) */}
            <div className="bg-white-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics mb-8-statistics">
                <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">Experiences Created per Day</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={experiencesPerDay} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        {/* Apply CSS classes and props for styling */}
                        <CartesianGrid strokeDasharray="3 3" className="chart-grid-lines-statistics" />
                        <XAxis dataKey="date" className="chart-axis-text-statistics" />
                        <YAxis className="chart-axis-text-statistics" />
                        <Tooltip className="chart-tooltip-statistics" />
                         <Legend  className="chart-legend-text-statistics"/>
                        <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Experiences Created" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

             {/* Incluidos Usage (Bar Chart) */}
            <div className="bg-white-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics mb-8-statistics">
                <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">"Incluidos" Usage</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={incluidosUsage} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        {/* Apply CSS classes and props for styling */}
                        <CartesianGrid strokeDasharray="3 3" className="chart-grid-lines-statistics" />
                        <XAxis dataKey="name" className="chart-axis-text-statistics"  />
                        <YAxis className="chart-axis-text-statistics" />
                        <Tooltip className="chart-tooltip-statistics" />
                         <Legend  className="chart-legend-text-statistics"/>
                        <Bar dataKey="value" fill="#FFBB28" name="Times Used" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Activity Type Usage (Bar Chart) */}
            <div className="bg-white-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics">
                <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">Activity Type Usage</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activityTypeUsage} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        {/* Apply CSS classes and props for styling */}
                        <CartesianGrid strokeDasharray="3 3" className="chart-grid-lines-statistics" />
                        <XAxis dataKey="name" className="chart-axis-text-statistics" />
                        <YAxis className="chart-axis-text-statistics" />
                        <Tooltip className="chart-tooltip-statistics" />
                        <Legend  className="chart-legend-text-statistics"/>
                        <Bar dataKey="value" fill="#00C49F" name="Times Chosen" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Statistics;