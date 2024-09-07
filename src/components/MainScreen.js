import React, { useState, useEffect } from 'react';
import { Box, Grid2, Input, InputAdornment, Typography, List, ListItem, ListItemText, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Search, Clear, AcUnitOutlined, ThunderstormOutlined, CloudOutlined, WbSunnyOutlined } from '@mui/icons-material';
import MainImage from "../data/mainImage.png";
import { fetchData } from '../api/api';
import LoadingSpinner from './LoadingSpinner';
import UnvalidImage from "../data/forUnvalid.png";
import Carousel from 'react-material-ui-carousel'
import AnkaraClear from "../data/ankaraClear.jpg";
import AnkaraCloud from "../data/ankaraCloud.jpg";
import AnkaraRain from "../data/ankaraRain.jpg";
import AnkaraSnow from "../data/ankaraSnow.jpg";
import IzmirClear from "../data/izmirClear.jpg";
import IzmirCloud from "../data/izmirCloud.jpg";
import IzmirRain from "../data/izmirRain.jpg";
import IstabulClear from "../data/istanbulClear.jpg";
import IstanbulCloud from "../data/istanbulCloud.jpg";
import IstanbulRain from "../data/istanbulRain.jpg";
import IstanbulSnow from "../data/istanbulSnow.jpg";
import Snowy from "../data/snowy.jpg";
import Rainy from "../data/rainy.jpg";
import Sunny from "../data/sunny.jpg";
import Cloudy from "../data/cloudy.jpg";

const cache = {};

const MainScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState(0);
    const [istanbul, setIstanbul] = useState([]);
    const [izmir, setIzmir] = useState([]);
    const [Ankara, setAnkara] = useState([]);

    const normalizeString = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const fetchCityData = async () => {
        setLoading(true);
        console.log('Cache status before fetching:', cache);

        // Check if the data for all cities is already in cache
        if (cache["Istanbul"] && cache["Ankara"] && cache["Izmir"]) {
            console.log('Using cached data');

            setIstanbul(cache["Istanbul"]);
            setAnkara(cache["Ankara"]);
            setIzmir(cache["Izmir"]);
            setLoading(false);
            return;
        }
    
        try {
            const cities = ["Istanbul", "Ankara", "Izmir"];
            const newCache = {}; // Object to store data fetched in this call
    
            for (const city of cities) {
                // If city data is already cached, skip the fetch
                if (!cache[city]) {
                    console.log(`Fetching data for ${city}`);
                    const result = await fetchData(city);
                    if (result && result.address) {
                        const normalizedCityName = normalizeString(result.address);
                        const dataToCache = result.days.slice(0, 1); // Assuming you want only the first day
    
                        if (normalizedCityName === normalizeString("istanbul")) {
                            setIstanbul(dataToCache);
                        } else if (normalizedCityName === normalizeString("ankara")) {
                            setAnkara(dataToCache);
                        } else if (normalizedCityName === normalizeString("izmir")) {
                            setIzmir(dataToCache);
                        }
                        
                        // Update the cache with the newly fetched data
                        newCache[city] = dataToCache;
                    }
                } else {
                    // If data is in cache, use it
                    console.log(`Using cached data for ${city}`);
                    const cityData = cache[city];
                    if (city === "Istanbul") setIstanbul(cityData);
                    if (city === "Ankara") setAnkara(cityData);
                    if (city === "Izmir") setIzmir(cityData);
                }
            }
    
            // Update the global cache with the data fetched in this call
            Object.assign(cache, newCache);
    
            // Update weatherData with cached data
            setWeatherData({ Istanbul: cache["Istanbul"], Ankara: cache["Ankara"], Izmir: cache["Izmir"] });
    
        } catch (error) {
            console.error('Error fetching city data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCityData();
    }, []);

    console.log("xd",Ankara, istanbul, izmir)
    
    const handleSearch = async () => {
        if (!searchTerm) return;
    
        setLoading(true);
        const normalizedSearchTerm = normalizeString(searchTerm);
    
        if (cache[normalizedSearchTerm]) {
            console.log('Using cached data');
            setWeatherData(cache[normalizedSearchTerm]);
            setSelectedCity(searchTerm);
            setLoading(false);
            return;
        }
    
        try {
            const result = await fetchData(searchTerm);
    
            if (result && normalizeString(result.address) === normalizedSearchTerm) {
                const dataToCache = result.days.slice(0, 7); // Assuming you want the first 7 days of forecast
                cache[normalizedSearchTerm] = dataToCache;
                setWeatherData(dataToCache);
                setSelectedCity(result.address);
            } else {
                setWeatherData(null);
                setSelectedCity(searchTerm);
            }
        } catch (error) {
            console.error('Error fetching city data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSelectedCity(null)
        setWeatherData([]);
    };

    const handleRowClick = (index) => {
        setSelectedDay(index);
    };

    const getDayName = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    const fahrenheitToCelsius = (fahrenheit) => {
        return Math.round((fahrenheit - 32) * 5 / 9);
    };

    const formatDayMonth = (datetime) => {
        const date = new Date(datetime);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are 0-based
        return `${day}, ${month < 10 ? `0${month}` : month}`;
    };
    

    const getWeatherIcon = (conditions) => {

        const desc = conditions.toLowerCase();

        if (desc.includes('snow ')) {
            return <AcUnitOutlined sx={{color:'#296573'}}/>
        }
        if (desc.includes('rain') && !desc.includes('snow ')) {
            return <ThunderstormOutlined sx={{color:'#296573'}}/>
        }
        if (desc.includes('cloud') && !desc.includes('rain') && !desc.includes('snow ')) {
            return <CloudOutlined sx={{color:'#296573'}}/>
        }
        if (desc.includes('clear')) {
            return <WbSunnyOutlined sx={{color:'#296573'}}/>
        }
    };
    const getCityImages = (city, conditions) => {
        const desc = conditions.toLowerCase();
        let imageSrc = null;
    
        if (desc.includes('snow')) {
            imageSrc = city === "ankara" ? AnkaraSnow : city === "izmir" ? IstanbulSnow : IstanbulSnow;
        } else if (desc.includes('rain')) {
            imageSrc = city === "ankara" ? AnkaraRain : city === "izmir" ? IzmirRain : IstanbulRain;
        } else if (desc.includes('cloud')) {
            imageSrc = city === "ankara" ? AnkaraCloud : city === "izmir" ? IzmirCloud : IstanbulCloud;
        } else if (desc.includes('clear')) {
            imageSrc = city === "ankara" ? AnkaraClear : city === "izmir" ? IzmirClear : IstabulClear;
        }
    
        return (
            <Box
                sx={{
                    position: 'relative',
                    height: '300px',
                    width: '100%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {imageSrc && (
                    <img
                        src={imageSrc}
                        alt="Weather"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            objectFit: 'cover',
                            height: '100%',
                            width: 'auto'
                        }}
                    />
                )}
            </Box>
        );
    };     

    const getWeatherImages = (conditions) => {
        const desc = conditions.toLowerCase();
        const imageSrc = desc.includes('snow') ? Snowy :
                         desc.includes('rain') ? Rainy :
                         desc.includes('cloud') ? Cloudy :
                         desc.includes('clear') ? Sunny :
                         null; 
    
        return (
            <Box
                sx={{ 
                    position: 'relative', 
                    height: '250px', 
                    width: '100%', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                }}
            >
                {imageSrc && (
                    <img 
                        src={imageSrc} 
                        alt="Weather" 
                        style={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)', 
                            objectFit: 'cover', 
                            height: '100%', 
                            width: 'auto' 
                        }} 
                    />
                )}
            </Box>
        );
    };
    

    return (
        <Grid2 container direction={{ xs: 'column-reverse', sm: 'column-reverse', md: 'row' }} gap={{xs:10, md:0}} 
            alignItems={{xs:"center", md:"start"}} justifyContent={"space-evenly"} pt={15} pb={5}>
            <Grid2 size={{ xs: 11.2, sm: 9, md: 6.5, lg: selectedCity ? 7 : 4.5, xl: selectedCity ? 6 : 4 }}>
                {loading ? (
                    <LoadingSpinner />
                ) : selectedCity && weatherData ? (
                    <Box>
                        <TableContainer sx={{ backgroundColor:"#ffffff91", borderRadius: "12px", border: "1px solid #DBDFE9", padding: "20px 0px 0px 0px", textAlign: "center", boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.03)" }}>
                            <Typography width={"max-content"} textAlign={'left'} color='#071437' fontSize={"20px"} fontWeight={"600"} marginTop={1} marginLeft={2} marginBottom={2}>
                                Weather Forecast for <span style={{ textTransform: 'capitalize', color:"#296573" }}>{selectedCity}</span>
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ backgroundColor: "#fcfcfc8a", border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"}, textAlign:{xs:"center", sm:"left"} }}>
                                            <Typography fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"} color='#4B5675'>Days</Typography>
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: "#fcfcfc8a", border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"}, textAlign:{xs:"center", sm:"left"} }}>
                                            <Typography fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"} color='#4B5675'>Lowest Temp.</Typography>
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: "#fcfcfc8a", border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"}, textAlign:{xs:"center", sm:"left"} }}>
                                            <Typography fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"} color='#4B5675'>Highest Temp.</Typography>
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: "#fcfcfc8a", border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"}, textAlign:{xs:"center", sm:"left"} }}>
                                            <Typography fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"} color='#4B5675'>conditions</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {weatherData?.map((day, index) => (
                                        <TableRow key={index} onClick={() => handleRowClick(index)}
                                            sx={{
                                                cursor: 'pointer',
                                                backgroundColor: selectedDay === index ? '#E0F7FA !important' : 'transparent',
                                                '&:hover': {
                                                    backgroundColor: '#fcfcfc8a'
                                                }
                                            }}>
                                            <TableCell sx={{border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"},
                                                textAlign:{xs:"center", sm:"left"} }}>
                                                <Typography color='#252F4A' fontWeight={"500"} fontSize={{xs:"16px", sm:"18px"}}>{getDayName(day.datetime)}</Typography>
                                                <Typography color='#252F4A' fontWeight={"400"} fontSize={{xs:"16px", sm:"18px"}}> {formatDayMonth(day.datetime)}</Typography>
                                            </TableCell>
                                            <TableCell sx={{border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"}, 
                                                textAlign:{xs:"center", sm:"left"} }}>
                                                <Typography color='#252F4A' fontWeight={"400"} fontSize={{xs:"16px", sm:"18px"}}>{Math.round(fahrenheitToCelsius(day.tempmin))} °C</Typography>
                                            </TableCell>
                                            <TableCell sx={{border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"}, 
                                                textAlign:{xs:"center", sm:"left"} }}>
                                                <Typography color='#252F4A' fontWeight={"400"} fontSize={{xs:"16px", sm:"18px"}}>{Math.round(fahrenheitToCelsius(day.tempmax))} °C</Typography>
                                            </TableCell>
                                            <TableCell sx={{border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"}, 
                                                textAlign:{xs:"center", sm:"left"} }}>
                                                <Typography color='#252F4A' fontWeight={"400"} fontSize={{xs:"16px", sm:"18px"}}>{day.conditions}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ) : (
                    <Carousel>
                        <Box textAlign={'center'} sx={{backgroundColor:"#ffffff91", padding:"40px", 
                            boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.03)", borderRadius: "10px"}}>
                            <Box display={'flex'} flexDirection={'column'} gap={"5px"} justifyContent={'center'} alignItems={'center'} >
                                {Ankara.length > 0 && getCityImages("ankara", Ankara[0].conditions)}
                                <Typography color="#296573" fontSize={ "56px" } fontWeight={"700"}>{Ankara.length > 0 ? `${fahrenheitToCelsius(Ankara[0].tempmax)} °C` : 'No data'} </Typography>
                                <Box display={'flex'} flexDirection={'column'} gap={"10px"}>
                                    <Typography color="#313131" fontSize={"32px"} fontWeight={"700"} sx={{ textTransform: 'capitalize' }}>
                                        Ankara
                                    </Typography>
                                    <Typography color="#313131" fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"}>
                                        {Ankara.length > 0 && formatDate(Ankara[0].datetime)}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent={"center"} gap={"5px"}>
                                    {Ankara.length > 0 && getWeatherIcon(Ankara[0].conditions)}
                                    <Typography color="#296573" fontSize={{xs:"16px", sm:"18px"}} fontWeight={"400"}>
                                    {Ankara.length > 0 && Ankara[0].conditions}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box textAlign={'center'} sx={{backgroundColor:"#ffffff91", padding:"40px", boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.03)", borderRadius: "10px"}}>
                            <Box display={'flex'} flexDirection={'column'} gap={"5px"} justifyContent={'center'} alignItems={'center'}>
                                {istanbul.length > 0 && getCityImages("istanbul", istanbul[0].conditions)}
                                <Typography color="#296573" fontSize={ "56px" } fontWeight={"700"}> {istanbul.length > 0 ? `${fahrenheitToCelsius(istanbul[0].tempmax)} °C` : 'No data'}</Typography>
                                <Box display={'flex'} flexDirection={'column'} gap={"10px"}>
                                    <Typography color="#313131" fontSize={"32px"} fontWeight={"700"} sx={{ textTransform: 'capitalize' }}>
                                        İstanbul
                                    </Typography>
                                    <Typography color="#313131" fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"}>
                                        {istanbul.length > 0 && formatDate(istanbul[0].datetime)}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent={"center"} gap={"5px"}>
                                    {istanbul.length > 0 && getWeatherIcon(istanbul[0].conditions)}
                                    <Typography color="#296573" fontSize={{xs:"16px", sm:"18px"}} fontWeight={"400"}>
                                    {istanbul.length > 0 && istanbul[0].conditions}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box textAlign={'center'} sx={{backgroundColor:"#ffffff91", padding:"40px", boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.03)", borderRadius: "10px"}}>
                            <Box display={'flex'} flexDirection={'column'} gap={"5px"} justifyContent={'center'} alignItems={'center'}>
                                {izmir.length > 0 && getCityImages("izmir", izmir[0].conditions)}
                                <Typography color="#296573" fontSize={ "56px" } fontWeight={"700"}>{izmir.length > 0 ? `${fahrenheitToCelsius(izmir[0].tempmax)} °C` : 'No data'} </Typography>
                                <Box display={'flex'} flexDirection={'column'} gap={"10px"}>
                                    <Typography color="#313131" fontSize={"32px"} fontWeight={"700"} sx={{ textTransform: 'capitalize' }}>
                                        İzmir
                                    </Typography>
                                    <Typography color="#313131" fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"}>
                                        {izmir.length > 0 && formatDate(izmir[0].datetime)}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent={"center"} gap={"5px"}>
                                    {izmir.length > 0 && getWeatherIcon(izmir[0].conditions)}
                                    <Typography color="#296573" fontSize={{xs:"16px", sm:"18px"}} fontWeight={"400"}>
                                    {izmir.length > 0 && izmir[0].conditions}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Carousel>
                )}
            </Grid2>
            <Grid2 size={{ xs: 8, sm: 7, md: 3.5, lg: 4, xl: 3 }} display={"flex"} flexDirection={"column"} gap={4}>
                <Input fullWidth disableUnderline placeholder="Search City"
                    sx={{ border: "1px solid #DBDFE9", borderRadius: "10px", padding: {xs:"5px", sm:"14px"}, backgroundColor:"#ffffff91",
                        fontSize: {xs:"18px", sm:"20px"}, boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.03)"}}
                    startAdornment={
                        searchTerm && (
                            <InputAdornment position="start">
                                <IconButton onClick={clearSearch}>
                                    <Clear />
                                </IconButton>
                            </InputAdornment>
                        )
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={handleSearch}>
                                <Search />
                            </IconButton>
                        </InputAdornment>
                    } value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown}
                />
                {selectedCity && weatherData ? (
                    <Box bgcolor={"#ffffff91"} sx={{ borderRadius: "12px", border: "1px solid #DBDFE9", padding: { xs: "20px", lg: "30px" }, textAlign: "center", boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.03)" }}>
                        {getWeatherImages(weatherData[selectedDay].conditions)}
                        <Box display="flex" alignItems="center" justifyContent={"center"} gap={"5px"} mt={1}>
                            {getWeatherIcon(weatherData[selectedDay].conditions)}
                            <Typography color="#296573" fontSize={{xs:"16px", sm:"18px"}} fontWeight={"400"}>
                                {weatherData[selectedDay].conditions}
                            </Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'} gap={"5px"}>
                            <Typography color="#296573" fontSize={ "56px" } fontWeight={"700"}>{fahrenheitToCelsius(weatherData[selectedDay].tempmax)} °C</Typography>
                            <Box display={'flex'} flexDirection={'column'} gap={"10px"}>
                                <Typography color="#313131" fontSize={"32px"} fontWeight={"700"} sx={{ textTransform: 'capitalize' }}>
                                    {selectedCity}
                                </Typography>
                                <Typography color="#313131" fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"}>
                                    {formatDate(weatherData[selectedDay].datetime)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ) : selectedCity && !weatherData ? (
                    <Box bgcolor={"#ffffff91"} sx={{ borderRadius: "12px", border: "1px solid #DBDFE9", padding: { xs: "20px", lg: "40px" }, textAlign: "center", boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.03)" }}>
                        <Typography color="#313131" fontSize={{ xs: "28px", md: "32px" }} fontWeight={"700"}>Does not Exist</Typography>
                        <Typography color="#313131" fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"}>
                            Type a valid city name to get weekly forecast data.
                        </Typography>
                    </Box>
                ) : (
                    <Box bgcolor={"#ffffff91"} sx={{ borderRadius: "12px", border: "1px solid #DBDFE9", padding: { xs: "20px", lg: "40px" }, textAlign: "center", boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.03)" }}>
                        <Typography color="#313131" fontSize={{ xs: "28px", md: "32px" }} fontWeight={"700"}>Select a City</Typography>
                        <Typography color="#313131" fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"}>
                            Search and select a city to see results. Try typing the first letters of the city you want.
                        </Typography>
                    </Box>
                )}
            </Grid2>
        </Grid2>
    );
};

export default MainScreen;
