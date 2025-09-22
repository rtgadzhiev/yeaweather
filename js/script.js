class Weather {
  API_KEY = '46ff5802a90f1960e6531ed649a078b1';
  LOCAL_STORAGE_KEY = 'weather-query';

  selectors = {
    root: '[data-js-weather]',
    searchForm: '[data-js-search-form]',
    searchFormInput: '[data-js-search-form-input]',
    weatherCard: '[data-js-weather-card]',
    updateButton: '[data-js-update-button]',
  };

  state = {};

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    this.searchFormElement = document.querySelector(this.selectors.searchForm);
    this.searchFormInputElement = document.querySelector(
      this.selectors.searchFormInput
    );
    this.weatherCardElement = document.querySelector(
      this.selectors.weatherCard
    );
    this.updateButtonElement = document.querySelector(
      this.selectors.updateButton
    );

    this.bindEvents();
  }

  setCityToLocalStorage(city) {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, city);
  }

  getCityFromLocalStorage() {
    return localStorage.getItem(this.LOCAL_STORAGE_KEY);
  }

  async render(weather) {
    const {
      weatherIconId,
      cityName,
      temperature,
      weatherName,
      weatherDescription,
      wind,
      humidity,
      pressure,
    } = weather;

    this.weatherCardElement.innerHTML = `
        <header class="weather-card__header">
          <img
            class="weather-card__image"
            src="https://openweathermap.org/img/wn/${weatherIconId}@2x.png"
            alt="${weatherName}"
            loading="lazy"
          />
          <h2 class="weather-card__title">${cityName}</h2>
          <span class="weather-card__temperature"
            >${temperature}°C</span
          >
        </header>
        <ul class="weather-card__list info-card">
          <li class="weather-card__item info-card__item">
            <span class="info-card__title">Погода</span>
            <span class="info-card__text">${weatherDescription}</span>
          </li>
          <li class="weather-card__item info-card__item">
            <span class="info-card__title">Ветер</span>
            <span class="info-card__text">${wind} m/s</span>
          </li>
          <li class="weather-card__item info-card__item">
            <span class="info-card__title">Влажность</span>
            <span class="info-card__text">${humidity}%</span>
          </li>
          <li class="weather-card__item info-card__item">
            <span class="info-card__title">Давление</span>
            <span class="info-card__text">${pressure}</span>
          </li>
        </ul>
    `;
  }

  getWeather(data) {
    const weather = {
      weatherIconId: data.weather[0].icon,
      cityName: data.name,
      temperature: Math.ceil(data.main.temp),
      weather: data.weather[0].main,
      weatherDescription: data.weather[0].description,
      wind: data.wind.speed.toFixed(1),
      humidity: data.main.humidity,
      pressure: Math.ceil(data.main.pressure * 0.7506),
    };

    this.render(weather);
  }

  async fetchData(cityName) {
    const dataUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${this.API_KEY}&lang=ru&units=metric`;

    const data = await fetch(dataUrl).then((response) => response.json());
    this.getWeather(data);
  }

  onSearchFormSubmit = (event) => {
    event.preventDefault();

    const cityName = this.searchFormInputElement.value.trim();
    this.fetchData(cityName);
    this.setCityToLocalStorage(cityName);
    this.searchFormInputElement.value = '';
  };

  onUpdateButtonClick = () => {
    const city = this.getCityFromLocalStorage();
    this.fetchData(city);
  };

  bindEvents() {
    this.searchFormElement.addEventListener('submit', this.onSearchFormSubmit);
    this.updateButtonElement.addEventListener(
      'click',
      this.onUpdateButtonClick
    );
  }
}

new Weather();
