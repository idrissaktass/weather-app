import React, { useState, useEffect } from 'react';
import { Box, Grid2, Input, InputAdornment, Typography, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel, MenuItem, FormControl, Select,  
    Grid} from "@mui/material";
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
// import Cloudy from "../data/cloudy.jpg";
import PartiallyCloud from "../data/partiallyCloudy.jpg";
import { LineChart, areaElementClasses  } from '@mui/x-charts/LineChart';
import PartiallyCloudy from "../data/weather.gif"
import Cloudy from "../data/cloudy.gif"
import SunnyIcon from "../data/sunny.gif"
import RainyIcon from "../data/rainy.gif"
import Storm from "../data/storm.gif"
import Snow from "../data/snow.gif"
import Humidity from "../data/humidity.png"

const Tables = ({chartData, chartData2, selectedCity}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    // const [selectedCity, setSelectedCity] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState(0);
    const [istanbul, setIstanbul] = useState([]);
    const [izmir, setIzmir] = useState([]);
    const [Ankara, setAnkara] = useState([]);
    const [current, setCurrent] = useState("");
    const [xAxisData, setXAxisData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const [filter, setFilter] = useState('temperature');

    const groupByHours = (hours, chunkSize) => {
        const result = [];
        for (let i = 0; i < hours?.length; i += chunkSize) {
            result.push(hours?.slice(i, i + chunkSize));
        }
        return result;
    };

    const hours = weatherData[selectedDay]?.hours;
    const hourlyGroups = groupByHours(hours, 3);

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

        if (desc.includes('snow')) {
            // return <AcUnitOutlined sx={{color:'#296573'}}/>
            return <img src={Snow} width={"60%"} height={"auto"} style={{backgroundColor:"transparent"}}/>
        }
        if (desc.includes('rain') && !desc.includes('snow')) {
            // return <ThunderstormOutlined sx={{color:'#296573'}}/>
            return <img src={RainyIcon} width={"60%"} height={"auto"} style={{backgroundColor:"transparent"}}/>
        }
        if (desc.includes('cloud') && !desc.includes('rain') && !desc.includes('snow') && !desc.includes('partially')) {
            // return <CloudOutlined sx={{color:'#296573'}}/>
            return <img src={Cloudy} width={"60%"} height={"auto"} style={{backgroundColor:"transparent"}}/>
        }
        if (desc.includes('clear')) {
            // return <WbSunnyOutlined sx={{color:'#296573'}}/>
            return <img src={SunnyIcon} width={"60%"} height={"auto"} style={{backgroundColor:"transparent"}}/>
        }
        if (desc.includes('partially') && !desc.includes('rain')) {
            // return <Box component="img" src='../data/weather.gif' sx={{width:'100%', height:"auto"}}/>
            return <img src={PartiallyCloudy} width={"60%"} height={"auto"} style={{backgroundColor:"transparent"}}/>
        }
    };

    const chunkArray = (array, chunkSize) => {
        let result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          result.push(array.slice(i, i + chunkSize));
        }
        return result;
      }
      
      
    const groupedData = chunkArray(chartData, 12);

    const getWeatherAdvice = (conditions, temp) => {
        const celsiusTemp = fahrenheitToCelsius(temp);
        
        if ((conditions.includes("cloudy") || conditions.includes("Clear")) && celsiusTemp > 20) {
            return "Ideal day for a picnic!";
        } else if (conditions.includes("Rain") || conditions.includes("Overcast")) {
            return "It may rain, don't forget to take your umbrella or raincoat when you go out";
        } else if (conditions.includes("Snow")) {
            return "It may snow, cold weather awaits you, don't forget to drink something warm!";
        } else if (celsiusTemp < 0) {
            return "Don't you dare freeze!";
        } else if (celsiusTemp > 40) {
            return "Between 11.00-16.00, think twice before going out and don't shoot at the sun!";
        } else {
            return "Have a great day!";
        }
    };

    const getWeatherImages = (conditions) => {
        const desc = conditions.toLowerCase();
        const imageSrc = desc.includes('snow') ? Snowy :
                         desc.includes('rain') ? Rainy :
                         desc.includes('clear') ? Sunny :
                         desc === "partially cloudy" ? PartiallyCloud:
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
                            width: 'auto' ,
                            borderRadius:"10px"
                        }} 
                    />
                )}
            </Box>
        );
    };
    
    return(

        <Grid2>
            <Grid2 size={{xs:6}} display={'flex'} bgcolor={"#ffffff91"} sx={{ borderRadius: "12px", border: "1px solid #DBDFE9", 
                textAlign: "center", boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.03)" }}>
                {chartData2?.map((day, index) => (
                    <Grid2 key={index} size={{xs:10, sm:3, md:1.7}} borderRight={index === 4 ? "none" : "1px solid #DBDFE9"} padding={{xs: "20px", lg: "40px" }}>
                        <Box mb={2}>
                            <Typography color='#296573' fontWeight={"600"} fontSize={{xs:"18px", sm:"22px"}}>{getDayName(day.datetime)}</Typography>
                            <Typography color='lightslategray' fontWeight={"400"} fontSize={{xs:"14px", sm:"16px"}}> {formatDayMonth(day.datetime)}</Typography>
                        </Box>
                        <Box>
                            {getWeatherIcon(day.conditions)}
                            <Typography color='#296573' fontWeight={"600"} fontSize={{xs:"24px", sm:"32px"}}>
                                {day.temperature} °C
                            </Typography>
                        </Box>
                        <Box>
                            <Typography mt={1} display={'flex'} alignItems={"center"} color='lightslategray' gap={1} justifyContent={'center'}
                                fontWeight={"400"} fontSize={{xs:"16px", sm:"18px"}}>
                                <img src={Humidity} width={"15%"} height={"auto"}/> {day.humidity}%
                            </Typography>
                            <Typography mt={2} color='lightslategray' fontWeight={"400"} fontSize={{xs:"14px", sm:"16px"}}>
                                {day.conditions}
                            </Typography>
                        </Box>
                    </Grid2>
                ))}
            </Grid2>

            <Grid2 size={{xs:11}} display={'flex'}>
                <Carousel sx={{width:"100%"}}>
                {groupedData.map((group, groupIndex) => (
                    <Grid2
                    key={groupIndex}
                    container
                    display="flex"
                    bgcolor={"#ffffff91"}
                    sx={{
                        borderRadius: "12px",
                        border: "1px solid #DBDFE9",
                        textAlign: "center",
                        boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.03)",
                    }}
                    >
                    {group.map((day, index) => (
                        <Grid2
                        key={index}
                        size={{ xs: 12 / group.length, sm: 3, md: 1 }}
                        borderRight={index === group.length - 1 ? "none" : "1px solid #DBDFE9"}
                        padding={{ xs: "20px", lg: "40px" }}
                        >
                        <Box mb={2}>
                            <Typography color="#296573" fontWeight={"500"} fontSize={{ xs: "14px", sm: "18px" }}>
                            {day.time}
                            </Typography>
                        </Box>
                        <Box>
                            {/* Replace this with your icon rendering logic */}
                            {getWeatherIcon(day.conditions)}
                            <Typography color="#296573" fontWeight={"500"} fontSize={{ xs: "18px", sm: "24px" }}>
                            {day.temperature} °C
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                            mt={1}
                            display={"flex"}
                            alignItems={"center"}
                            color="lightslategray"
                            gap={1}
                            justifyContent={"center"}
                            fontWeight={"400"}
                            fontSize={{ xs: "12px", sm: "14px" }}
                            >
                            <img src={Humidity} width={"15%"} height={"auto"} /> {day.humidity}%
                            </Typography>
                            <Typography mt={2} color="lightslategray" fontWeight={"400"} fontSize={{ xs: "10px", sm: "12px" }}>
                            {day.conditions}
                            </Typography>
                        </Box>
                        </Grid2>
                    ))}
                    </Grid2>
                ))}
                </Carousel>
            </Grid2>     
        </Grid2>

    )
}

export default Tables;