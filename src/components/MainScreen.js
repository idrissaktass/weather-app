import React, { useState } from 'react';
import { Box, Grid2, Input, InputAdornment, Typography, List, ListItem, ListItemText, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Search, Clear, AcUnitOutlined, ThunderstormOutlined, CloudOutlined, WbSunnyOutlined } from '@mui/icons-material';
import MainImage from "../data/mainImage.png";
import { fetchData } from '../api/api';
import LoadingSpinner from './LoadingSpinner';
import UnvalidImage from "../data/forUnvalid.png";

const cache = {};

const MainScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState(0);

    const normalizeString = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };
    
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
            const result = await fetchData({ city: searchTerm });

            if (result && normalizeString(result.city_name) === normalizedSearchTerm){
                const dataToCache = result.data.slice(0, 7);
                cache[searchTerm] = dataToCache;
                setWeatherData(dataToCache);
                setSelectedCity(result.city_name);
            } else {
                setWeatherData(null);
                setSelectedCity(searchTerm);
            }

        } catch (error) {
            console.error('Error fetching city data:', error);
        }
        setLoading(false);
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

    const getWeatherIcon = (description) => {

        const desc = description.toLowerCase();

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

    return (
        <Grid2 container direction={{ xs: 'column-reverse', sm: 'column-reverse', md: 'row' }} gap={{xs:10, md:0}} 
            alignItems={{xs:"center", md:"start"}} justifyContent={"space-evenly"} my={20}>
            <Grid2 size={{ xs: 11.2, sm: 9, md: 6.5, lg: 5.7, xl: 4.5 }}>
                {loading ? (
                    <LoadingSpinner />
                ) : selectedCity && weatherData ? (
                    <Box>
                        <TableContainer sx={{ borderRadius: "12px", border: "1px solid #DBDFE9", padding: "20px 0px 0px 0px", textAlign: "center", boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.03)" }}>
                            <Typography width={"max-content"} textAlign={'left'} color='#071437' fontSize={"20px"} fontWeight={"600"} marginTop={1} marginLeft={2} marginBottom={2}>
                                Weather Forecast for <span style={{ textTransform: 'capitalize', color:"#296573" }}>{selectedCity}</span>
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ backgroundColor: "#FCFCFC", border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"}, textAlign:{xs:"center", sm:"left"} }}>
                                            <Typography fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"} color='#4B5675'>Days</Typography>
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: "#FCFCFC", border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"}, textAlign:{xs:"center", sm:"left"} }}>
                                            <Typography fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"} color='#4B5675'>Dates</Typography>
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: "#FCFCFC", border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"}, textAlign:{xs:"center", sm:"left"} }}>
                                            <Typography fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"} color='#4B5675'>Lowest Temp.</Typography>
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: "#FCFCFC", border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"}, textAlign:{xs:"center", sm:"left"} }}>
                                            <Typography fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"} color='#4B5675'>Highest Temp.</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {weatherData.map((day, index) => (
                                        <TableRow key={index} onClick={() => handleRowClick(index)}
                                            sx={{
                                                cursor: 'pointer',
                                                backgroundColor: selectedDay === index ? '#E0F7FA !important' : 'transparent',
                                                '&:hover': {
                                                    backgroundColor: '#FCFCFC'
                                                }
                                            }}>
                                            <TableCell sx={{border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"},
                                                textAlign:{xs:"center", sm:"left"} }}>
                                                <Typography color='#252F4A' fontWeight={"400"} fontSize={{xs:"16px", sm:"18px"}}>{getDayName(day.datetime)}</Typography>
                                            </TableCell>
                                            <TableCell sx={{border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"}, 
                                                textAlign:{xs:"center", sm:"left"} }} >
                                                <Typography color='#252F4A' fontWeight={"400"} fontSize={{xs:"16px", sm:"18px"}}>{formatDate(day.datetime)}</Typography>
                                            </TableCell>
                                            <TableCell sx={{border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"}, 
                                                textAlign:{xs:"center", sm:"left"} }}>
                                                <Typography color='#252F4A' fontWeight={"400"} fontSize={{xs:"16px", sm:"18px"}}>{Math.round(day.app_min_temp)} °C</Typography>
                                            </TableCell>
                                            <TableCell sx={{border: "1px solid #F1F1F4", padding:{xs:"15px 5px 15px 5px", sm:"16px"}, 
                                                textAlign:{xs:"center", sm:"left"} }}>
                                                <Typography color='#252F4A' fontWeight={"400"} fontSize={{xs:"16px", sm:"18px"}}>{Math.round(day.app_max_temp)} °C</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ) : selectedCity && !weatherData ? (
                    <img src={UnvalidImage} width={"100%"} alt="Main" />
                ) : (
                    <img src={MainImage} width={"100%"} alt="Main" />
                )}
            </Grid2>
            <Grid2 size={{ xs: 8, sm: 7, md: 3, lg: 3, xl: 3 }} display={"flex"} flexDirection={"column"} gap={4}>
                <Input fullWidth disableUnderline placeholder="Search City"
                    sx={{ border: "1px solid #DBDFE9", borderRadius: "10px", padding: {xs:"5px", sm:"14px"}, 
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
                    <Box sx={{ borderRadius: "12px", border: "1px solid #DBDFE9", padding: { xs: "20px", lg: "30px" }, textAlign: "center", boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.03)" }}>
                        <Box display={'flex'} flexDirection={'column'} gap={"20px"}>
                            <Typography color="#296573" fontSize={ "56px" } fontWeight={"700"}>{Math.round(weatherData[selectedDay].app_max_temp)} °C</Typography>
                            <Box display={'flex'} flexDirection={'column'} gap={"10px"}>
                                <Typography color="#313131" fontSize={"32px"} fontWeight={"700"} sx={{ textTransform: 'capitalize' }}>
                                    {selectedCity}
                                </Typography>
                                <Typography color="#313131" fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"}>
                                    {formatDate(weatherData[selectedDay].datetime)}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent={"center"} gap={"5px"}>
                                {getWeatherIcon(weatherData[selectedDay].weather.description)}
                                <Typography color="#296573" fontSize={{xs:"16px", sm:"18px"}} fontWeight={"400"}>
                                {weatherData[selectedDay].weather.description}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ) : selectedCity && !weatherData ? (
                    <Box sx={{ borderRadius: "12px", border: "1px solid #DBDFE9", padding: { xs: "20px", lg: "40px" }, textAlign: "center", boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.03)" }}>
                        <Typography color="#313131" fontSize={{ xs: "28px", md: "32px" }} fontWeight={"700"}>Does not Exist</Typography>
                        <Typography color="#313131" fontSize={{xs:"14px", sm:"16px"}} fontWeight={"400"}>
                            Type a valid city name to get weekly forecast data.
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ borderRadius: "12px", border: "1px solid #DBDFE9", padding: { xs: "20px", lg: "40px" }, textAlign: "center", boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.03)" }}>
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
