class DarkSkyWeatherCard extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = '/local/custom_ui/dark-sky-weather-card.css';
      card.appendChild(link);
      this.content = document.createElement('div');
      this.content.className = 'card';
      card.appendChild(this.content);
      this.appendChild(card);
    }

    const getUnit = function (measure) {
      const lengthUnit = hass.config.unit_system.length;
      switch (measure) {
        case 'air_pressure':
          return lengthUnit === 'km' ? 'hPa' : 'inHg';
        case 'length':
          return lengthUnit;
        case 'precipitation':
          return lengthUnit === 'km' ? 'mm' : 'in';
        default:
          return hass.config.unit_system[measure] || '';
      }
    };

    const transformDayNight = {
      "below_horizon": "night",
      "above_horizon": "day",
    }
    const sunLocation = transformDayNight[hass.states["sun.sun"]];
    const weatherIcons = {
      'clear-day': 'sunny',
      'clear-night': 'nt_clear',
      'rain': 'rain',
      'snow': 'flurries',
      'sleet': 'chanceflurries',
      'wind': 'hazy',
      'fog': 'fog',
      'cloudy': 'cloudy',
      'partly-cloudy-day': 'partlycloudy',
      'partly-cloudy-night': 'nt_partlycloudy',
      'hail': 'sleet',
      'lightning': 'chancetstorms',
      'thunderstorm': 'tstorms',
      'windy-variant': `cloudy-${sunLocation}-3`,
      'exceptional': '!!',
    }

    const windDirections = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
      'N'
    ];

    var forecastDate1 = new Date();
    forecastDate1.setDate(forecastDate1.getDate()+1);
    var forecastDate2 = new Date();
    forecastDate2.setDate(forecastDate2.getDate()+2);
    var forecastDate3 = new Date();
    forecastDate3.setDate(forecastDate3.getDate()+3);
    var forecastDate4 = new Date();
    forecastDate4.setDate(forecastDate4.getDate()+4);
    var forecastDate5 = new Date();
    forecastDate5.setDate(forecastDate5.getDate()+5);


    const currentConditions = hass.states["sensor.dark_sky_icon"].state;
    const humidity = hass.states["sensor.dark_sky_humidity"].state;
    const pressure = Math.round(hass.states["sensor.dark_sky_pressure"].state);
    const temperature = Math.round(hass.states["sensor.dark_sky_temperature"].state);
    const visibility = hass.states["sensor.dark_sky_visibility"].state;
    const windBearing = windDirections[(Math.round((hass.states["sensor.dark_sky_wind_bearing"].state / 360) * 16))];
    const weathercardbackground = hass.states["sensor.season"].state;
    const windSpeed = Math.round(hass.states["sensor.dark_sky_wind_speed"].state);
    const forecast1 = { date: forecastDate1,
    				   condition: "sensor.dark_sky_icon_1d",
    				   temphigh: "sensor.dark_sky_daytime_high_temperature_1d",
    				   templow:  "sensor.dark_sky_overnight_low_temperature_1d", };
    const forecast2 = { date: forecastDate2,
    				   condition: "sensor.dark_sky_icon_2d",
    				   temphigh: "sensor.dark_sky_daytime_high_temperature_2d",
    				   templow:  "sensor.dark_sky_overnight_low_temperature_2d", };
    const forecast3 = { date: forecastDate3,
    				   condition: "sensor.dark_sky_icon_3d",
    				   temphigh: "sensor.dark_sky_daytime_high_temperature_3d",
    				   templow:  "sensor.dark_sky_overnight_low_temperature_3d", };
    const forecast4 = { date: forecastDate4,
    				   condition: "sensor.dark_sky_icon_4d",
    				   temphigh: "sensor.dark_sky_daytime_high_temperature_4d",
    				   templow:  "sensor.dark_sky_overnight_low_temperature_4d", };
    const forecast5 = { date: forecastDate5,
    				   condition: "sensor.dark_sky_icon_5d",
    				   temphigh: "sensor.dark_sky_daytime_high_temperature_5d",
    				   templow:  "sensor.dark_sky_overnight_low_temperature_5d", };


    const forecast = [forecast1,forecast2,forecast3,forecast4,forecast5];


    this.content.innerHTML = `


    <div style="background: url(/local/pictures/${weathercardbackground}.jpg) no-repeat; background-size: cover; margin: auto; padding-top: 2em; padding-bottom: 1em; padding-left: 1em; padding-right: 1em; position: relative">
    <div style="background: rgba(0, 0, 0, 0.55); /* Black background with transparency */">
    <div class="div" style="padding-left: 2%, padding-right: 2%">
      <div class="div div1">
        <img src="/local/icons/weather_icons/icons/${weatherIcons[currentConditions]}.png" class="iconbigger"></i>
      </div>
      <div class="div temp">
        ${temperature}
      </div>
      <div class="div tempc">
        ${getUnit('temperature')}
      </div>
    <div class="div div4">
        <ul class="variations">
          <li><span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span>${windBearing} ${windSpeed}<span class="unit"> ${getUnit('length')}/h</span></li>
          <li><span class="ha-icon"><ha-icon icon="mdi:weather-fog"></ha-icon></span>${visibility}<span class="unit"> ${getUnit('length')}</span></li>
          <li><span class="ha-icon"><ha-icon icon="mdi:water-percent"></ha-icon></span>${humidity}<span class="unit"> %</span></li>
          <li><span class="ha-icon"><ha-icon icon="mdi:gauge"></ha-icon></span>${pressure}<span class="unit"> ${getUnit('air_pressure')}</span></li>
        </ul>
      </div>
    </div>
    <div class="forecast clear">
      ${forecast.map(daily => `
          <div class="day">
            <span class="dayname">${(daily.date).toString().split(' ')[0]}</span>
            <br><i class="icon" style="background: none, url(/local/icons/weather_icons/icons/${weatherIcons[hass.states[daily.condition].state]}.png) no-repeat; background-size: contain;"></i>
            <br><span class="highTemp">${Math.round(hass.states[daily.temphigh].state)}${getUnit('temperature')}</span>
            <br><span class="lowTemp">${Math.round(hass.states[daily.templow].state)}${getUnit('temperature')}</span>
          </div>`).join('')}
    </div></div></div>`;
  }

  getCardSize() {
    return 3;
  }

  setConfig(config) {
    this.config = config;
  }

}



customElements.define('dark-sky-weather-card', DarkSkyWeatherCard);

