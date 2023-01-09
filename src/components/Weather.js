import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { createClient } from 'pexels';

const client = createClient('563492ad6f9170000100000124732c9185d84f6cbaf98471b4b18663');
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const currentDay = new Date();

export default function Weather(props) {
    const [latitude, longitude] = props.props;
    const [info, setInfo] = useState(() => {});
    const [bgPicture, setBgPicture] = useState(() => '');
    const [query, setQuery] = useState(() => '');
    const [currentWeather, setCurrentWeather] = useState(() => []);
    const [forecast, setForecast] = useState(() => []);
    const [show, setShow] = useState(false);
    const [isFav, setIsFav] = useState(false);

    const weatherData = () => {
        return axios.request(`http://api.weatherapi.com/v1/forecast.json?key=18c224b14e0f4cbe92a205451223012&q=${latitude},${longitude}&days=5&aqi=no`).then(response => {
            return response.data;
        });        
    }

    useEffect(() => {
        document.getElementById("spinner").removeAttribute('hidden');

        weatherData().then(data => {
            setQuery(query => query = `represents ${data.location.name}`);
            setInfo(info => info = {
                cityName: data.location.name,
                currentWeather: {
                    temperature: Math.round(data.current.temp_c),
                    feelsLike: Math.round(data.current.feelslike_c),
                    condition: data.current.condition,
                    humidity: data.current.humidity
                },
                forecast: data.forecast.forecastday.map((day) => {
                    return {
                        date: day.date,
                        minTemperature: Math.round(day.day.mintemp_c),
                        maxTemperature: Math.round(day.day.maxtemp_c),
                        condition: day.day.condition,
                        humidity: day.day.avghumidity,
                        rainChance: day.day.daily_chance_of_rain
                    };
                })
            })
        })
    }, [longitude, latitude])

    useEffect(() => {
        if(query !== '')
            client.photos.search({ query, orientation: "landscape", per_page: 1}).then(photos => photos.photos[0].src.landscape).then(resp => {
                setBgPicture(bgPicture => bgPicture = resp);
            }).catch(err => setBgPicture(bgPicture => bgPicture = 'https://imgs.search.brave.com/jL93EnWoeeqdBcuXGUyAqZ-Zybplg9w2VelkJikoHiY/rs:fit:693:500:1/g:ce/aHR0cHM6Ly9jZG4u/YnJpdGFubmljYS5j/b20vczo3MDB4NTAw/Lzk4LzE0NDQ5OC0w/NTAtQUE4RkQzM0Uv/Q29tbXVuYWwtUGFs/YWNlLUJ1emF1LVJv/bWFuaWEuanBn'));
    }, [query])

    const isFavorite = () => {
        const FAVS = (localStorage.getItem('favorites')??[]).split(",");
        if(FAVS.length !== 0){
            for(const elem in FAVS){
                if(`${info.cityName} (${latitude.toFixed(3)}/${longitude.toFixed(3)})` === FAVS[elem]){
                    setIsFav(isFav => isFav = true);
                    return ;
                }
            }
        }
        setIsFav(isFav => isFav = false);
    }

    const updateFavorites = (elem) => {
        const FAVS = localStorage.getItem('favorites');
        if(isFav === false){
            localStorage.setItem('favorites', [FAVS, `${info.cityName} (${latitude.toFixed(3)}/${longitude.toFixed(3)})`]);
            setIsFav(isFav => isFav = true);
        } else{
            localStorage.setItem('favorites', FAVS.split(",").filter((elem) => elem !== `${info.cityName} (${latitude.toFixed(3)}/${longitude.toFixed(3)})`));
            setIsFav(isFav => isFav = false);
        }
    }

    const showCurrentWeather = () => {
        return (
            <div className = 'currentInfo'>
                <div className = "relevantInfo">
                    <span className = "cityName" title = "Add to favorites">
                        {info.cityName} - Now
                        <input type="checkbox" checked={isFav} onChange={updateFavorites}/>
                    </span>
                    <div className = "otherInfo">
                        <span className = "temperature">{info.currentWeather.temperature}°C</span> 
                        <span>Feels like {info.currentWeather.feelsLike}°C</span>
                        <span>Humidity: {info.currentWeather.humidity}%</span>
                    </div>
                </div>
                <div className = "icon">
                    <span>{info.currentWeather.condition.text}</span>
                    <img src = {`https:${info.currentWeather.condition.icon}`}></img>
                </div>
            </div>
        )
    }

    const showForecast = () => {
        return info.forecast.map((day, i) => {
            return (
                <div className = 'forecastInfo'>
                    <div className = "relevantInfo">
                        <span className = "date">{DAYS[(currentDay.getDay() + i) % 7]}</span> 
                        <div className = "otherInfo">
                            <span>Min temperature: {day.minTemperature}°C</span> 
                            <span>Max temperature: {day.maxTemperature}°C</span>
                            <span>Humidity: {day.humidity}%</span> 
                            <span>Rain chance: {day.rainChance}%</span>
                        </div>
                    </div>
                    <div className = "icon">
                        <span>{day.condition.text}</span>
                        <img src = {`https:${day.condition.icon}`}></img>
                    </div>
                </div>
            )
        })
    }
    
    useEffect(() => {
        if(info) {
            isFavorite();
            setCurrentWeather(currentWeather => currentWeather = showCurrentWeather());
            setForecast(forecast => forecast = showForecast());
            setTimeout(() => {
                document.getElementById("spinner").setAttribute('hidden', '');
                setShow(show => show = true);
            }, [1000]);
        }
    }, [info, isFav])

    return (
        <div className = "weather" >
            <div className = "current">
                {show && currentWeather}
                {show && (<img src = {`${bgPicture}`}></img>)}
            </div>
            <div className = "forecast">
                {show && forecast}
            </div>    
        </div>
    )
}
