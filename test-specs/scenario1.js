const assert = require('assert')
const axios = require('axios')

describe('Scenario 1: Darksky UI temperature is equal to API temperature', () => {
    let tempUI, tempAPI, apiData;
    //get apiData before the tests
    before(async () => {
        apiData = await axios.get('https://api.darksky.net/forecast/4d51fbb64d23886e24bc76aa280a1497/40.7506,-73.9971')
    })

    it('should return the same tempature values', () => {
        browser.url('/')
        //search 10001 and grab temperature at location
        const searchButton = $('form .searchButton')
        const searchInput = $('form input')
        searchInput.clearValue()
        searchInput.addValue('10001')
        searchButton.click()

        //wait until new temperature loads
        temp = $('.summary.swap')
        temp.waitForDisplayed(3000)
        tempUI = temp.getText()
        tempUI = Number(tempUI.slice(0, tempUI.indexOf('˚')))

        //grab api temperature
        const info = apiData.data.currently
        tempAPI = Math.round(info.temperature)

        expect(tempAPI).to.be.equal(tempUI)
    })
})

describe('Scenario 2: Validate temperature times', () => {
    let apiData;
    before(async () => {
        apiData = await axios.get('https://api.darksky.net/forecast/4d51fbb64d23886e24bc76aa280a1497/40.7506,-73.9971')
    })

    it('should get all temperature values', () => {
        let timeline = $('.temps').$$('span span')
        timeline = timeline.map(time => {
            let temp = time.getText()
            temp = temp.slice(0, temp.length - 1)
            return Number(temp)
        })

        const hourlyInfo = apiData.data.hourly.data
        let hourlyTemps = []
        for (let i = 0; i < hourlyInfo.length; i += 2) {
            hourlyTemps.push(Math.round(hourlyInfo[i].temperature))
        }
        hourlyTemps[0] = timeline[0]
        hourlyTemps = hourlyTemps.slice(0, 12)

        expect(timeline).to.eql(hourlyTemps)
    })
})

describe('Scenario 3: Checks other UI components to API', () => {
    let apiData;
    before(async () => {
        apiData = await axios.get('https://api.darksky.net/forecast/4d51fbb64d23886e24bc76aa280a1497/40.7506,-73.9971')
        apiData = apiData.data.currently
    })

    it('should check wind speed is correct', () => {
        const wind = Number($('.num.swip.wind__speed__value').getText())
        let apiWind = apiData.windSpeed
        //check which way to round api numbers
        wind > apiWind ? apiWind = Math.ceil(apiWind) : apiWind = Math.floor(apiWind);
        assert.strictEqual(wind, apiWind)
    })

    it('should check humidity', () => {
        const humidity = Number($('.num.swip.humidity__value').getText())
        let apiHumidity = apiData.humidity * 100
        //check which way to round api numbers
        humidity > apiHumidity ? apiHumidity = Math.ceil(apiHumidity) : apiHumidity = Math.floor(apiHumidity);
        assert.strictEqual(humidity, apiHumidity)
    })

    it('should check Dew Point', () => {
        const dewPt = Number($('.num.dew__point__value').getText())
        let apiDewPt = apiData.dewPoint
        //check which way to round api numbers
        dewPt > apiDewPt ? apiDewPt = Math.ceil(apiDewPt) : apiDewPt = Math.floor(apiDewPt);
        assert.strictEqual(dewPt, apiDewPt)
    })

    it('should check UV Index', () => {
        const uvIndex = Number($('.num.uv__index__value').getText())
        let apiUVIndex = apiData.uvIndex
        //check which way to round api numbers
        uvIndex > apiUVIndex ? apiUVIndex = Math.ceil(apiUVIndex) : apiUVIndex = Math.floor(apiUVIndex);
        assert.strictEqual(uvIndex, apiUVIndex)
    })

    it('should check visibility', () => {
        let visibility = $('.num.swip.visibility__value').getText()
        visibility = Number(visibility.slice(0, visibility.length - 1))
        let apiVisibility = apiData.visibility
        //check which way to round api numbers
        visibility > apiVisibility ? apiVisibility = Math.ceil(apiVisibility) : apiVisibility = Math.floor(apiVisibility);
        assert.strictEqual(visibility, apiData.visibility)
    })

    it('should check pressure', () => {
        const pressure = Number($('.num.swip.pressure__value').getText())
        let apiPressure = apiData.pressure
        //check which way to round api numbers
        pressure > apiPressure ? apiPressure = Math.ceil(apiPressure) : apiPressure = Math.floor(apiPressure);
        assert.strictEqual(pressure, apiPressure)
    })
})