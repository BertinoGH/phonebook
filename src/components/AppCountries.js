import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppCountries = () => {
    const [countries, setCountries] = useState([]);
    const [filter, setFilter] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [weather, setWeather] = useState(null);


    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all').then((response) => {
            setCountries(response.data);
        });
    }, []);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setSelectedCountry(null);
    };

    const filteredCountries = countries.filter((country) =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
    );

    const handleShowCountryClick = (country) => {
        setSelectedCountry(country);
        getWeatherData(country.capital[0]);
    };

    const getWeatherData = (capital) => {
        const apiKey = process.env.REACT_APP_API_KEY;
        const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${capital}`;
        axios.get(url).then((response) => {
            setWeather(response.data);
        });
    };

    const content = () => {
        if (selectedCountry) {
            const { name, capital, population, languages, flags } = selectedCountry;
            return (
                <div>
                    <h2>{name.common}</h2>
                    <div>capital {capital}</div>
                    <div>population {population}</div>
                    <h3>languages</h3>
                    <ul>
                        {Object.values(languages).map((language) => (
                            <li key={language}>{language}</li>
                        ))}
                    </ul>
                    <img src={flags.png} alt={`Flag of ${name.common}`} width="200px" />
                    {weather && (
  <div>
    <h3>Weather in {capital}</h3>
    <div>temperature: {weather.current.temperature} °C</div>
    <img src={weather.current.weather_icons[0]} alt={weather.current.weather_descriptions[0]} />
    <div>wind: {weather.current.wind_speed} mph direction {weather.current.wind_dir}</div>
  </div>
)}
                </div>
            );
        } else if (filteredCountries.length > 10) {
            return <div>Too many matches, specify another filter</div>;
        } else if (filteredCountries.length === 1) {
            const { name, capital, population, languages, flags } = filteredCountries[0];
            const countryCode = filteredCountries[0].alpha2Code;
            getWeatherData(capital)
            return (
                <div>
                    <h2>{name.common}</h2>
                    <div>capital {capital}</div>
                    <div>population {population}</div>
                    <h3>languages</h3>
                    <ul>
                        {Object.values(languages).map((language) => (
                            <li key={language}>{language}</li>
                        ))}
                    </ul>
                    <img src={flags.png} alt={`Flag of ${name.common}`} width="200px" />
                    {weather && (
                        <div>
                            <h3>Weather in {capital}</h3>
                            <div>temperature: {weather.current.temperature} °C</div>
                            <img src={weather.current.weather_icons[0]} alt={weather.current.weather_descriptions[0]} />
                            <div>wind: {weather.current.wind_speed} mph direction {weather.current.wind_dir}</div>
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <div>
                    {filteredCountries.map((country) => (
                        <div key={country.cca3}>
                            {country.name.common}
                            <button onClick={() => handleShowCountryClick(country)}>show</button>
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div>
            <div>
                find countries <input value={filter} onChange={handleFilterChange} />
            </div>
            {content()}
        </div>
    );
};

export default AppCountries;


