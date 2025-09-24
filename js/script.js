class Weather {
  API_KEY = '46ff5802a90f1960e6531ed649a078b1';
  LOCAL_STORAGE_KEY = 'weather-query';

  selectors = {
    root: '[data-js-weather]',
    searchForm: '[data-js-search-form]',
    searchFormInput: '[data-js-search-form-input]',
    weatherCard: '[data-js-weather-card]',
    updateButton: '[data-js-update-button]',
    loading: '[data-js-loading]',
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    this.searchFormElement = document.querySelector(this.selectors.searchForm);
    this.searchFormInputElement = document.querySelector(
      this.selectors.searchFormInput
    );
    this.weatherCardElement = document.querySelector(
      this.selectors.weatherCard
    );
    this.loadingElement = document.querySelector(this.selectors.loading);

    this.bindEvents();
    this.renderFromLocalStorage();
  }

  setCityToLocalStorage(city) {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, city);
  }

  getCityFromLocalStorage() {
    return localStorage.getItem(this.LOCAL_STORAGE_KEY);
  }

  async renderFromLocalStorage() {
    const city = this.getCityFromLocalStorage();

    if (city) {
      const data = await this.fetchData(city);
      const weather = this.getWeather(data);

      this.render(weather);
    }
  }

  showLoadingIndicator() {
    this.loadingElement.classList.remove('hidden');
  }

  hideLoadingIndicator() {
    this.loadingElement.classList.add('hidden');
  }

  render(weather) {
    if (weather) {
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
            <span class="info-card__text">${wind} м/с</span>
          </li>
          <li class="weather-card__item info-card__item">
            <span class="info-card__title">Влажность</span>
            <span class="info-card__text">${humidity}%</span>
          </li>
          <li class="weather-card__item info-card__item">
            <span class="info-card__title">Давление</span>
            <span class="info-card__text">${pressure} мм.рт.ст.</span>
          </li>
        </ul>
        <button class="weather__button button" data-js-update-button>
          Обновить
        </button>
    `;
    } else {
      this.weatherCardElement.innerHTML = '';
    }
  }

  getWeather(data) {
    if (!data) return;

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

    return weather;
  }

  async fetchData(cityName) {
    const dataUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${this.API_KEY}&lang=ru&units=metric`;

    try {
      const response = await fetch(dataUrl);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Город не найден!');
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  onSearchFormSubmit = async (event) => {
    this.showLoadingIndicator();
    event.preventDefault();

    const city = this.searchFormInputElement.value.trim();

    if (city) {
      try {
        this.showLoadingIndicator();
        const data = await this.fetchData(city);

        if (data) {
          const weather = this.getWeather(data);
          this.render(weather);
          this.setCityToLocalStorage(city);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        this.hideLoadingIndicator();
        this.searchFormInputElement.value = '';
      }
    }
  };

  onUpdateButtonClick = (event) => {
    const updateButtonElement = document.querySelector(
      this.selectors.updateButton
    );

    if (event.target === updateButtonElement) {
      this.renderFromLocalStorage();
    }
  };

  bindEvents() {
    this.searchFormElement.addEventListener('submit', this.onSearchFormSubmit);
    this.weatherCardElement.addEventListener('click', this.onUpdateButtonClick);
  }
}

new Weather();
