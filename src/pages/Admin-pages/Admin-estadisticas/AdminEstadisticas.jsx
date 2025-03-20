import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";
import { adminBaseStyles } from '../../../components/Admin-components/adminBaseStyles';
import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
    BarChart, Bar
} from 'recharts';
import '../../../components/firebase-test/Statistics/Statistics.css';

const AdminEstadisticas = () => {

    // State variables
    const [userTypeDistribution, setUserTypeDistribution] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imagesPerDay, setImagesPerDay] = useState([]);
    // const [experiencesPerDay, setExperiencesPerDay] = useState([]); // Removed experiencesPerDay
    const [incluidosUsage, setIncluidosUsage] = useState([]);
    const [activityTypeUsage, setActivityTypeUsage] = useState([]);
    const [forumAndCommentData, setForumAndCommentData] = useState([]);
    const [hashtagUsage, setHashtagUsage] = useState([]);
    const [paymentsPerDay, setPaymentsPerDay] = useState([]);
    const [revenuePerDay, setRevenuePerDay] = useState([]);


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
                    .sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')));
                setImagesPerDay(imagesPerDayData);
            } catch (err) {
                console.error("Error fetching image upload data:", err);
                setError("Failed to load image upload statistics.");
            } finally {
                setLoading(false);
            }
        };

        // Removed fetchExperienceData
        const fetchExperienceData = async () => {
            try {
                const experiencesCollection = collection(db, 'Experiencias');
                const querySnapshot = await getDocs(experiencesCollection);

                const incluidosCount = {};
                const activityTypeCount = {};

                querySnapshot.forEach((doc) => {
                    const experienceData = doc.data();

                    if (Array.isArray(experienceData.incluidosExperiencia)) {
                        experienceData.incluidosExperiencia.forEach(incluido => {
                            incluidosCount[incluido] = (incluidosCount[incluido] || 0) + 1;
                        });
                    }

                    if (experienceData.tipoActividad) {
                        activityTypeCount[experienceData.tipoActividad] = (activityTypeCount[experienceData.tipoActividad] || 0) + 1;
                    }
                });


                const incluidosUsageData = Object.entries(incluidosCount).map(([name, value]) => ({ name, value }))
                    .sort((a, b) => b.value - a.value);

                const activityTypeUsageData = Object.entries(activityTypeCount).map(([name, value]) => ({ name, value }))
                    .sort((a, b) => b.value - a.value);

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
                    .sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')));
                setForumAndCommentData(combinedData);

            } catch (error) {
                console.error("Error fetching forum and comment data:", error);
                setError("Failed to load forum and comment statistics.");
            } finally {
                setLoading(false);
            }
        };

        const fetchHashtagData = async () => {
            try {
                const galleryCollection = collection(db, 'Galeria de Imágenes');
                const querySnapshot = await getDocs(galleryCollection);
                const hashtagCounts = {};

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.images && Array.isArray(data.images)) {
                        data.images.forEach(image => {
                            if (image.hashtags && Array.isArray(image.hashtags)) {
                                image.hashtags.forEach(hashtag => {
                                    const normalizedHashtag = hashtag.toLowerCase();
                                    hashtagCounts[normalizedHashtag] = (hashtagCounts[normalizedHashtag] || 0) + 1;
                                });
                            }
                        });
                    }
                });

                const hashtagData = Object.entries(hashtagCounts)
                    .map(([hashtag, count]) => ({ hashtag, count }))
                    .sort((a, b) => b.count - a.count);

                setHashtagUsage(hashtagData);

            } catch (err) {
                console.error("Error fetching hashtag data:", err);
                setError("Failed to load hashtag statistics.");
            }
        };

        const fetchPaymentData = async () => {
            try {
                const paymentsCollection = collection(db, 'payments');
                const paymentsSnapshot = await getDocs(paymentsCollection);
                
                console.log(`Found ${paymentsSnapshot.size} payment documents`);
                
                const paymentsPerDayMap = {};
                const revenuePerDayMap = {};

                paymentsSnapshot.forEach((doc) => {
                    try {
                        const userData = doc.data();
                        console.log(`Processing user document:`, doc.id);
                        
                        // Check if this document has bookings
                        if (userData.bookings && typeof userData.bookings === 'object') {
                            // Loop through all bookings in this document
                            Object.entries(userData.bookings).forEach(([bookingId, bookingData]) => {
                                console.log(`Processing booking:`, bookingId, bookingData);
                                
                                // Check if the booking is completed and has a timestamp
                                if (bookingData.status === 'COMPLETED' && bookingData.timestamp) {
                                    // Extract date from timestamp (format: "2025-03-19T03:47:53.941Z")
                                    const timestampStr = bookingData.timestamp;
                                    const paymentDate = timestampStr.split('T')[0]; // Get YYYY-MM-DD part
                                    
                                    console.log(`Payment date from timestamp: ${paymentDate}`);
                                    
                                    // Extract amount
                                    let amount = 0;
                                    if (bookingData.amount) {
                                        // Clean amount string if needed (remove currency symbols, etc.)
                                        let amountStr = bookingData.amount.toString().replace(/[^0-9.]/g, '');
                                        amount = parseFloat(amountStr);
                                    } else if (bookingData.paymentDetails && bookingData.paymentDetails.amount) {
                                        let amountStr = bookingData.paymentDetails.amount.toString().replace(/[^0-9.]/g, '');
                                        amount = parseFloat(amountStr);
                                    }
                                    
                                    console.log(`Amount for this booking: ${amount}`);
                                    
                                    // Add to maps using the payment date (from timestamp)
                                    paymentsPerDayMap[paymentDate] = (paymentsPerDayMap[paymentDate] || 0) + 1;
                                    
                                    if (!isNaN(amount)) {
                                        revenuePerDayMap[paymentDate] = (revenuePerDayMap[paymentDate] || 0) + amount;
                                    }
                                } else {
                                    console.log(`Skipping booking - Not completed or no timestamp: status=${bookingData.status}, timestamp=${bookingData.timestamp}`);
                                }
                            });
                        } else {
                            console.log(`Document ${doc.id} has no bookings property or it's not an object`);
                        }
                    } catch (err) {
                        console.error(`Error processing document ${doc.id}:`, err);
                    }
                });
                
                console.log('Payments per day map:', paymentsPerDayMap);
                console.log('Revenue per day map:', revenuePerDayMap);
                
                const paymentsPerDayData = Object.entries(paymentsPerDayMap)
                    .map(([date, count]) => ({ date, count }))
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                    
                const revenuePerDayData = Object.entries(revenuePerDayMap)
                    .map(([date, total]) => ({ date, total }))
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                    
                console.log('Final payments data:', paymentsPerDayData);
                console.log('Final revenue data:', revenuePerDayData);
                
                setPaymentsPerDay(paymentsPerDayData);
                setRevenuePerDay(revenuePerDayData);
            } catch (err) {
                console.error("Error fetching payment data:", err);
                setError("Failed to load payment statistics. Check console for details.");
            }
        };



        fetchUserTypeData();
        fetchImageUploadData();
        // fetchExperienceData(); // Removed call
        fetchExperienceData(); // Call fetchExperienceData to load Incluidos and Activity Type.
        fetchForumAndCommentData();
        fetchHashtagData();
        fetchPaymentData();

    }, []);

    if (loading) {
        return (
            <div className={`inset-0 mx-2 sm:mx-4 md:mx-8 lg:mx-16 xl:mx-24 my-6 flex flex-col justify-start items-start px-4 md:px-8 ${adminBaseStyles}`}>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
             <div className={`inset-0 mx-2 sm:mx-4 md:mx-8 lg:mx-16 xl:mx-24 my-6 flex flex-col justify-start items-start px-4 md:px-8 ${adminBaseStyles}`}>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`inset-0 mx-2 sm:mx-4 md:mx-8 lg:mx-16 xl:mx-24 my-6 flex flex-col justify-start items-start px-4 md:px-8 ${adminBaseStyles}`}>
            <h1 className=" text-white text-4xl md:text-5xl font-bold">
                Estadísticas
            </h1>
            <h1 className=" text-white text-lg md:text-lg">
                Control de todas las estadísticas generadas.
            </h1>
            <hr className="border-1 border-white-600 sm:w-10 md:w-96 mb-4" />
            <h1 className=" text-white text-3xl md:text-3xl font-bold">
                Informacion Relevante
            </h1>
            <hr className="border-1 border-white-600 sm:w-10 md:w-96 mb-4" />

            <div className="container-statistics mx-auto-statistics px-4-statistics py-8-statistics">
                {/* Row 1: User Types and Images */}
                <div className="flex-statistics flex-wrap-statistics">
                    <div className="w-full-statistics md:w-3/5-statistics p-4-statistics">
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

                    <div className="w-full-statistics md:w-3/5-statistics p-4-statistics">
                        <div className="bg-light-green-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics h-full-statistics">
                            <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">Imágenes subidas por día</h2>
                            <ResponsiveContainer width="95%" height={300}>
                                <BarChart data={imagesPerDay} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="chart-grid-lines-statistics" />
                                    <XAxis dataKey="date" className="chart-axis-text-statistics" />
                                    <YAxis className="chart-axis-text-statistics" />
                                    <Tooltip className="chart-tooltip-statistics" />
                                    <Legend className="chart-legend-text-statistics" />
                                    <Bar dataKey="count" fill="#8884d8" name="Imágenes publicadas" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Row 2:  Incluidos  -- Removed Experiences Chart, kept Incluidos */}
                <div className="flex-statistics flex-wrap-statistics">
                    <div className="w-full-statistics md:w-3/5-statistics p-4-statistics">
                        <div className="bg-light-green-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics h-full-statistics">
                            <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">Tipos de "Incluidos en la Experiencia"</h2>
                            <ResponsiveContainer width="95%" height={300}>
                                <BarChart data={incluidosUsage} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="chart-grid-lines-statistics" />
                                    <XAxis dataKey="name" className="chart-axis-text-statistics" />
                                    <YAxis className="chart-axis-text-statistics" />
                                    <Tooltip className="chart-tooltip-statistics" />
                                    <Legend className="chart-legend-text-statistics" />
                                    <Bar dataKey="value" fill="#FFBB28" name="Veces usadas" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Row 3: Activity Type and Forums/Comments */}
                <div className="flex-statistics flex-wrap-statistics">
                    <div className="w-full-statistics md:w-3/5-statistics p-4-statistics">
                        <div className="bg-light-green-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics h-full-statistics">
                            <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">Tipos de actividad usadas</h2>
                            <ResponsiveContainer width="95%" height={300}>
                                <BarChart data={activityTypeUsage} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="chart-grid-lines-statistics" />
                                    <XAxis dataKey="name" className="chart-axis-text-statistics" />
                                    <YAxis className="chart-axis-text-statistics" />
                                    <Tooltip className="chart-tooltip-statistics" />
                                    <Legend className="chart-legend-text-statistics" />
                                    <Bar dataKey="value" fill="#00C49F" name="Veces escogidas" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="w-full-statistics md:w-3/5-statistics p-4-statistics">
                        <div className="bg-light-green-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics h-full-statistics">
                            <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">Foros y Comentarios por día</h2>
                            <ResponsiveContainer width="95%" height={300}>
                                <LineChart data={forumAndCommentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="chart-grid-lines-statistics" />
                                    <XAxis dataKey="date" className="chart-axis-text-statistics" />
                                    <YAxis className="chart-axis-text-statistics" />
                                    <Tooltip className="chart-tooltip-statistics" />
                                    <Legend className="chart-legend-text-statistics" />
                                    <Line type="monotone" dataKey="forums" stroke="#8884d8" name="Foros" />
                                    <Line type="monotone" dataKey="comments" stroke="#FF8042" name="Comentarios" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                {/* Row 4: Hashtag Bar Chart */}
                <div className="w-full-statistics p-4-statistics">
                    <div className="bg-light-green-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics h-full-statistics">
                        <h2 className="text-gray-700-statistics">Hashtags más usados</h2>
                        {hashtagUsage.length > 0 ? (
                            <ResponsiveContainer width="95%" height={300}>
                                <BarChart
                                    data={hashtagUsage}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" className="chart-grid-lines-statistics" />
                                    <XAxis dataKey="hashtag" className="chart-axis-text-statistics" angle={-45} textAnchor="end" height={100} interval={0} />
                                    <YAxis className="chart-axis-text-statistics" />
                                    <Tooltip className="chart-tooltip-statistics" />
                                    <Legend className="chart-legend-text-statistics" />
                                    <Bar dataKey="count" fill="#8884d8" name="Veces usadas" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center-statistics text-gray-500-statistics">No hashtags found.</p>
                        )}
                    </div>
                </div>

                {/* Row 5: Payments and Revenue */}
                <div className="flex-statistics flex-wrap-statistics">
                   <div className="w-full-statistics md:w-3/5-statistics p-4-statistics">
                        <div className="bg-light-green-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics h-full-statistics">
                            <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">Pagos Completados por Día</h2>
                            <ResponsiveContainer width="95%" height={300}>
                                <LineChart data={paymentsPerDay} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="chart-grid-lines-statistics" />
                                    <XAxis dataKey="date" className="chart-axis-text-statistics" />
                                    <YAxis className="chart-axis-text-statistics" />
                                    <Tooltip className="chart-tooltip-statistics" />
                                    <Legend className="chart-legend-text-statistics" />
                                    <Line type="monotone" dataKey="count" stroke="#8884d8" name="Pagos realizados" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                   <div className="w-full-statistics md:w-3/5-statistics p-4-statistics">
                        <div className="bg-light-green-statistics p-6-statistics rounded-lg-statistics shadow-lg-statistics h-full-statistics">
                            <h2 className="text-xl-statistics font-semibold-statistics mb-4-statistics text-gray-700-statistics">Ingresos por Día</h2>
                            <ResponsiveContainer width="95%" height={300}>
                                <LineChart data={revenuePerDay} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="chart-grid-lines-statistics" />
                                    <XAxis dataKey="date" className="chart-axis-text-statistics" />
                                    <YAxis className="chart-axis-text-statistics" />
                                    <Tooltip className="chart-tooltip-statistics" />
                                    <Legend className="chart-legend-text-statistics" />
                                    <Line type="monotone" dataKey="total" stroke="#82ca9d" name="Ingresos totales (USD)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default AdminEstadisticas;