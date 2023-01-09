import React, {useEffect, useState} from 'react'
import axios from "axios";

const errMSG = 'Nu am putut cauta orase.';

export default function Searchbar(props) {
  const [value, setValue] = useState(() => '');
  const [citiesInfo, setCitiesInfo] = useState(() => []);

  const suggestions =  function(){
    if(value.length >= 3) {
      const options = {
        method: 'GET',
        url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
        params: {limit: '5', namePrefix: `${value}`, sort: '-population', types: 'CITY'},
        headers: {
          'X-RapidAPI-Key': '1f460494f1mshc936c9757e6346ep1f8fb0jsn266187969983',
          'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
      };
      
      return axios.request(options).then(function (response) {
        return response.data.data.map( (city) => { 
            return {
              name: city.name,
              country: city.country,
              latitude: city.latitude,
              longitude: city.longitude
            };
          });
      }).catch(function (error) {
        return errMSG;
      });
    }
  }

  const cityNamesAutoComplete = function (data){
    return (
      <datalist id = "suggestions">
          {
            data.map((city, i) => {
                return (     
                    <option value = {`${city.name} (${city.country})`} key = {`"option_${i}`}/>
                )   
            })
          }
      </datalist>
    )
  }

  const favoritesAutoComplete = function (){
    return (
      <datalist id = "suggestions">
          {
            localStorage.getItem('favorites').split(',').map((fav, i) => {
                return (     
                    <option value = {`${fav.split("(")[0]}`} key = {`"option_${i}`}/>
                )   
            })
          }
      </datalist>
    )
  }

  useEffect(() => {
    if(value.length >= 3){
      const searchC = localStorage.getItem('favorites').split(",").find((elem) => elem.split("(")[0] === value);
      if(searchC){
        props.changeCity({latitude: parseFloat(searchC.split(" (")[1].split("/")[0]), longitude: parseFloat(searchC.split(" (")[1].split("/")[1].split(")")[0])})
      } else {
        suggestions().then((data) => {
          if(data !== errMSG) {
            data.forEach((city) => {
              setCitiesInfo(citiesInfo => [...citiesInfo, 
                {
                  name: city.name,
                  country: city.country,
                  longitude: city.longitude,
                  latitude: city.latitude
                }]);
            })
          }
        });
      }
    }
    
    return setCitiesInfo(citiesInfo => citiesInfo = []);
  }, [value])

  const onChange = (event) => {
    setValue(value => value = event.target.value)

    props.changeCity(
      citiesInfo.find((city) => `${city.name} (${city.country})` === event.target.value)
    )
  }

  return (
    <div className = "search_bar">
      <input type = "text" list = "suggestions" placeholder = "Enter a city name" value = {value} onChange = {onChange} ></input>
      {value.length === 0 && favoritesAutoComplete()}
      {citiesInfo.length !== 0 && cityNamesAutoComplete(citiesInfo)}
    </div>
  )
}
