// Statistics.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
    BarChart, Bar
} from 'recharts';
import './Statistics.css';

const Statistics = () => {
    const [userTypeDistribution, setUserTypeDistribution] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imagesPerDay, setImagesPerDay] = useState([]);
    const [experiencesPerDay, setExperiencesPerDay] = useState([]);
    const [incluidosUsage, setIncluidosUsage] = useState([]);
    const [activityTypeUsage, setActivityTypeUsage] = useState([]);
    const [forumAndCommentData, setForumAndCommentData] = useState([]);


    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];


    useEffect(() => {
        const fetchUserTypeData = async () => {
            try {
                const usersCollection = collection(db, 'lista-de-usuarios');
                const querySnapshot = await getDocs(usersCollection);
                const userTypeCounts = {};

                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    const userType = userData.userType;
                    if (userType) {
                        userTypeCounts[userType] = (userTypeCounts[userType] || 0) + 1;
                    } else {
                        console.warn(`User with ID ${doc.id} has no userType`);
                    }
                });

                const userTypeData = Object.entries(userTypeCounts).map(([name, value]) => ({ name, value }));
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
                const imagesPerDayMap = {};

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.images && Array.isArray(data.images)) {
                        data.images.forEach(image => {
                            const datePart = image.uploadDate.split('/').slice(0, 3).join('/');
                            imagesPerDayMap[datePart] = (imagesPerDayMap[datePart] || 0) + 1;
                        });
                    }
                });

                const imagesPerDayData = Object.entries(imagesPerDayMap).map(([date, count]) => ({ date, count }))
                    .sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-'))); // ASCENDING order
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
                    const creationTimestamp = doc.metadata.creationTime;

                    if (creationTimestamp) {
                        const creationDate = new Date(creationTimestamp);
                        const dateStr = `${String(creationDate.getDate()).padStart(2, '0')}/${String(creationDate.getMonth() + 1).padStart(2, '0')}/${creationDate.getFullYear()}`;
                        experiencesPerDayMap[dateStr] = (experiencesPerDayMap[dateStr] || 0) + 1;
                    }

                    if (Array.isArray(experienceData.incluidosExperiencia)) {
                        experienceData.incluidosExperiencia.forEach(incluido => {
                            incluidosCount[incluido] = (incluidosCount[incluido] || 0) + 1;
                        });
                    }

                    if (experienceData.tipoActividad) {
                        activityTypeCount[experienceData.tipoActividad] = (activityTypeCount[experienceData.tipoActividad] || 0) + 1;
                    }
                });

                const experiencesPerDayData = Object.entries(experiencesPerDayMap).map(([date, count]) => ({ date, count }))
                    .sort((a, b) =>  new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-'))); //ASCENDING Order

                const incluidosUsageData = Object.entries(incluidosCount).map(([name, value]) => ({ name, value }))
                    .sort((a, b) => b.value - a.value);

                const activityTypeUsageData = Object.entries(activityTypeCount).map(([name, value]) => ({ name, value }))
                    .sort((a, b) => b.value - a.value);

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

        const fetchForumAndCommentData = async () => {
            try {
                const forumsCollection = collection(db, 'Foros');
                const forumsSnapshot = await getDocs(forumsCollection);
                const combinedDataMap = {};

                for (const forumDoc of forumsSnapshot.docs) {
                    const forumData = forumDoc.data();
                    if (forumData.Date) {
                        const datePart = forumData.Date.split('/').slice(0, 3).join('/');
                        combinedDataMap[datePart] = combinedDataMap[datePart] || { date: datePart, forums: 0, comments: 0 };
                        combinedDataMap[datePart].forums++;
                    }

                    const commentsCollection = collection(db, 'Foros', forumDoc.id, 'comments');
                    const commentsSnapshot = await getDocs(commentsCollection);

                    for (const commentDoc of commentsSnapshot.docs) {
                        const commentData = commentDoc.data();
                        if (commentData.Date) {
                            const datePart = commentData.Date.split('/').slice(0, 3).join('/');
                            combinedDataMap[datePart] = combinedDataMap[datePart] || { date: datePart, forums: 0, comments: 0 };
                            combinedDataMap[datePart].comments++;
                        }

                        async function processNestedComments(commentId, commentPath) {
                            const nestedCommentsCollection = collection(db, ...commentPath, commentId, 'comments');
                            const nestedCommentsSnapshot = await getDocs(nestedCommentsCollection);
                            for (const nestedCommentDoc of nestedCommentsSnapshot.docs) {
                                const nestedCommentData = nestedCommentDoc.data();
                                if (nestedCommentData.Date) {
                                    const datePart = nestedCommentData.Date.split('/').slice(0, 3).join('/');
                                    combinedDataMap[datePart] = combinedDataMap[datePart] || { date: datePart, forums: 0, comments: 0 };
                                    combinedDataMap[datePart].comments++;
                                }
                                await processNestedComments(nestedCommentDoc.id, [...commentPath, commentId, 'comments']);
                            }
                        }
                        await processNestedComments(commentDoc.id, ['Foros', forumDoc.id, 'comments']);
                    }
                }

                const combinedData = Object.values(combinedDataMap)
                    .sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-'))); //ASCENDING Order
                setForumAndCommentData(combinedData);

            } catch (error) {
                console.error("Error fetching forum and comment data:", error);
                setError("Failed to load forum and comment statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserTypeData();
        fetchImageUploadData();
        fetchExperienceData();
        fetchForumAndCommentData();
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
            <h1 className="text-3xl-statistics font-bold-statistics text-center-statistics mb-8-statistics text-light-green-statistics">Estadísticas</h1>

            {/* Row 1: User Types and Images */}
            <div className="flex-statistics flex-wrap-statistics">
                <div className="w-full-statistics md:w-1/2-statistics p-4-statistics">
                    <div className="bg-light-green-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics h-full-statistics">
                        <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">Tipos de Usuarios Registrados</h2>
                        <ResponsiveContainer width="95%" height={300}>
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
                                <Tooltip className="chart-tooltip-statistics" />
                                <Legend className="chart-legend-text-statistics" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="w-full-statistics md:w-1/2-statistics p-4-statistics">
                    <div className="bg-light-green-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics h-full-statistics">
                        <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">Images Uploaded per Day</h2>
                         <ResponsiveContainer width="95%" height={300}>
                            <BarChart data={imagesPerDay} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="chart-grid-lines-statistics" />
                                <XAxis dataKey="date" className="chart-axis-text-statistics" />
                                 {/* YAxis with light green text */}
                                <YAxis className="chart-axis-text-statistics" />
                                <Tooltip className="chart-tooltip-statistics" />
                                <Legend className="chart-legend-text-statistics" />
                                <Bar dataKey="count" fill="#8884d8" name="Images Uploaded" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
           </div>

            {/* Row 2: Experiences and Incluidos */}
            <div className="flex-statistics flex-wrap-statistics">
                <div className="w-full-statistics md:w-1/2-statistics p-4-statistics">
                    <div className="bg-light-green-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics h-full-statistics">
                        <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">Experiences Created per Day</h2>
                        <ResponsiveContainer width="95%" height={300}>
                            <LineChart data={experiencesPerDay} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="chart-grid-lines-statistics" />
                                <XAxis dataKey="date" className="chart-axis-text-statistics" />
                                  {/* YAxis with light green text */}
                                <YAxis className="chart-axis-text-statistics"  />
                                <Tooltip className="chart-tooltip-statistics" />
                                <Legend className="chart-legend-text-statistics" />
                                <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Experiences Created" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="w-full-statistics md:w-1/2-statistics p-4-statistics">
                    <div className="bg-light-green-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics h-full-statistics">
                        <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">"Incluidos" Usage</h2>
                        <ResponsiveContainer width="95%" height={300}>
                            <BarChart data={incluidosUsage} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="chart-grid-lines-statistics" />
                                <XAxis dataKey="name" className="chart-axis-text-statistics" />
                                  {/* YAxis with light green text */}
                                <YAxis className="chart-axis-text-statistics" />
                                <Tooltip className="chart-tooltip-statistics" />
                                <Legend className="chart-legend-text-statistics" />
                                <Bar dataKey="value" fill="#FFBB28" name="Times Used" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Row 3: Activity Type and Forums/Comments */}
            <div className="flex-statistics flex-wrap-statistics">
                <div className="w-full-statistics md:w-1/2-statistics p-4-statistics">
                    <div className="bg-light-green-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics h-full-statistics">
                        <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">Activity Type Usage</h2>
                        <ResponsiveContainer width="95%" height={300}>
                            <BarChart data={activityTypeUsage} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="chart-grid-lines-statistics" />
                                <XAxis dataKey="name" className="chart-axis-text-statistics" />
                                  {/* YAxis with light green text */}
                                <YAxis className="chart-axis-text-statistics" />
                                <Tooltip className="chart-tooltip-statistics" />
                                <Legend className="chart-legend-text-statistics" />
                                <Bar dataKey="value" fill="#00C49F" name="Times Chosen" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="w-full-statistics md:w-1/2-statistics p-4-statistics">
                    <div className="bg-light-green-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics h-full-statistics">
                        <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">Forums and Comments per Day</h2>
                        <ResponsiveContainer width="95%" height={300}>
                            <LineChart data={forumAndCommentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="chart-grid-lines-statistics" />
                                <XAxis dataKey="date" className="chart-axis-text-statistics" />
                                  {/* YAxis with light green text */}
                                <YAxis className="chart-axis-text-statistics" />
                                <Tooltip className="chart-tooltip-statistics" />
                                <Legend className="chart-legend-text-statistics" />
                                <Line type="monotone" dataKey="forums" stroke="#8884d8" name="Forums" />
                                <Line type="monotone" dataKey="comments" stroke="#FF8042" name="Comments" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Statistics;