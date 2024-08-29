import { Oval } from 'react-loader-spinner';
import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
	const [input, setInput] = useState('');
	const [weather, setWeather] = useState({
		loading: false,
		data: {},
		error: false,
	});
	const [forecastData, setForecastData] = useState(null);

	const toDateFunction = () => {
		const months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		const WeekDays = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		];
		const currentDate = new Date();
		const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]
			}`;
		return date;
	};

	const fetchForecast = async (cityName) => {
		const url = 'https://api.openweathermap.org/data/2.5/forecast';
		const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
		try {
			const res = await axios.get(url, {
				params: {
					q: cityName,
					units: 'metric',
					appid: api_key,
				},
			});
			// Filter forecast data to get one entry per day (e.g., 12:00 PM)
			const filteredData = res.data.list.filter(item => item.dt_txt.includes("12:00:00"));
			setForecastData(filteredData);
		} catch (error) {
			console.log('Forecast error', error);
		}
	};

	const search = async (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			setInput('');
			setWeather({ ...weather, loading: true });
			const url = 'https://api.openweathermap.org/data/2.5/weather';
			const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
			await axios
				.get(url, {
					params: {
						q: input,
						units: 'metric',
						appid: api_key,
					},
				})
				.then((res) => {
					console.log('res', res);
					setWeather({ data: res.data, loading: false, error: false });
					fetchForecast(input);
				})
				.catch((error) => {
					setWeather({ ...weather, data: {}, error: true });
					setInput('');
					console.log('error', error);
				});
		}
	};

	return (
		<div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
			<h1 className="mb-5 text-center text-primary">Weather Forecast App</h1>
			<div className="input-group mb-5 w-90">
				<input
					type="text"
					className="form-control"
					placeholder="Enter City Name.."
					value={input}
					onChange={(event) => setInput(event.target.value)}
					onKeyPress={search}
				/>
			</div>
			{weather.loading && (
				<div className="d-flex justify-content-center my-5">
					<Oval type="Oval" color="black" height={100} width={100} />
				</div>
			)}
			{weather.error && (
				<div className="text-center text-danger my-5">
					<FontAwesomeIcon icon={faFrown} size="3x" />
					<p className="mt-3">City not found</p>
				</div>
			)}
			{weather && weather.data && weather.data.main && (
				<div className="card text-center shadow-lg p-4 mb-4" style={{ width: '20rem' }}>
					<div className="card-body">
						<h2 className="card-title">
							{weather.data.name}, <span>{weather.data.sys.country}</span>
						</h2>
						<p className="card-text">{toDateFunction()}</p>
						<img
							src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
							alt={weather.data.weather[0].description}
							className="my-3"
						/>
						<h3 className="display-4">
							{Math.round(weather.data.main.temp)}
							<sup>°C</sup>
						</h3>
						<p className="text-uppercase">{weather.data.weather[0].description}</p>
						<p>Wind Speed: {weather.data.wind.speed} m/s</p>
					</div>
				</div>
			)}
			{forecastData && forecastData.length > 0 && (
				<div className="w-100 mt-5">
					<h3 className="text-center mb-4">5-Day Forecast</h3>
					<div className="d-flex justify-content-around">
						{forecastData.map((day, index) => (
							<div key={index} className="card text-center shadow-sm p-3" style={{ width: '12rem' }}>
								<span className="font-weight-bold">{new Date(day.dt * 1000).toLocaleDateString()}</span>
								<img
									src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
									alt={day.weather[0].description}
									className="my-2"
								/>
								<h4>{Math.round(day.main.temp)}°C</h4>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
