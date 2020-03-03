function forecast(city) {
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&apikey=f955041c9dab522ef41c605e377bdbdc"
    $.ajax({
        url:queryUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        $(".castBox").empty();
        var day = response.list;
        var dexDay = 1;
        var week = $("<div>");
        week.attr("class", "weekBoxes");
        for(var i = 4; i < day.length; i+=8) {
            var minTemp = 0;
            var humidity = 0;
            var castBox = $("<div>");
            var castDay = $("<h4>");
            var castPic = $("<span>");
            var castTemp = $("<p>");
            var castTempIcon = $("<span>");
            var castHum = $("<p>");
            var castHumIcon = $("<span>");
            castBox.attr("class", "box col-lg");
            castDay.text(moment().add(dexDay, 'd').format("ddd") + " ");
            dexDay++;
            if (day[i].weather[0].main === "Clear") {
                castPic.attr("class", "fas fa-sun");
            }
            else if (day[i].weather[0].main === "Clouds") {
                castPic.attr("class", "fas fa-cloud");
            }
            else if (day[i].weather[0].main === "Drizzle") {
                castPic.attr("class", "fas fa-cloud-rain");
            }
            else if (day[i].weather[0].main === "Rain") {
                castPic.attr("class", "fas fa-cloud-showers-heavy");
            }
            else if (day[i].weather[0].main === "Thunderstorm") {
                castPic.attr("class", "fas fa-bolt");
            }
            else if (day[i].weather[0].main === "Snow") {
                castPic.attr("class", "fas fa-snowflake");
            }
            else if (day[i].weather[0].main >= 700 && response.weather[0].id < 800) {
                castPic.attr("class", "fas fa-smog");
            }
            castDay.append(castPic);
            castBox.append(castDay);
            minTemp = day[i].main.temp_min;
            minTemp = KtoF(minTemp);
            castTemp.text(" " + minTemp + String.fromCharCode(176) + "F");
            if(minTemp <= "75") {
                castTempIcon.attr("class", "fas fa-temp-low");
            }
            else {
                castTempIcon.attr("class", "fas fa-temp-high");
            }
            castBox.append(castTemp);
            castTemp.prepend(castTempIcon);
            humidity = day[i].main.humidity;
            humidity = humidity.toFixed(0);
            castHum.text(" " + humidity + "%");
            castHumIcon.attr("class", "fas fa-tint");
            castBox.append(castHum);
            castHum.prepend(castHumIcon);
            week.append(castBox);
        }
        $(".castBox").append(week);
    })
}
function currentWeather(city) {
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&apikey=f955041c9dab522ef41c605e377bdbdc"
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        cityName = $("<p>");
        cityName.text(response.name + " (" + moment().format("MM/DD/YYYY") + ") ");
        cityName.attr("class", "h2");
        var weatherIcon = $("<span>");
        var temp = $("<p>");
        var humidity = $("<p>");
        var windSpeed = $("<p>");
        if (response.weather[0].main === "Clouds") {
            weatherIcon.attr("class", "fas fa-cloud");
        }
        else if (response.weather[0].main === "Clear") {
            weatherIcon.attr("class", "fas fa-sun");
        }
        else if (response.weather[0].main === "Thunderstorm") {
            weatherIcon.attr("class", "fas fa-bolt");
        }
        else if (response.weather[0].main === "Drizzle") {
            weatherIcon.attr("class", "fas fa-cloud-rain");
        }
        else if (response.weather[0].main === "Rain") {
            weatherIcon.attr("class", "fas fa-cloud-showers-heavy");
        }
        else if (response.weather[0].main === "Snow") {
            weatherIcon.attr("class", "fas fa-snowflake");
        }
        else if (response.weather[0].id >= 700 && response.weather[0].id < 800) {
            weatherIcon.attr("class", "fas fa-smog");
        }
        cityName.append(weatherIcon);
        $("#output").append(cityName);
        temp.text("Temp: " + KtoF(response.main.temp) + String.fromCharCode(176) + "F");
        $("#output").append(temp);
        windSpeed.text("Wind: " + convertSecToHour(response.wind.speed) + " mph");
        $("#output").append(windSpeed);
        humidity.text("Humidity: " + response.main.humidity + String.fromCharCode(37));
        $("#output").append(humidity);
        uvDex(response.coord.lat, response.coord.lon);
        forecast(city);
    })
}
function convertSecToHour(num) {
    var mph = num * 2.23694;
    mph = mph.toFixed(2);
    return mph;
}
function KtoF(num) {
    var temp = (num - 273.15) * 1.8000 + 32.00;
    temp = temp.toFixed(1);
    return temp;
}
function uvDex(lat, lon) {
    var uvUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=f955041c9dab522ef41c605e377bdbdc&lat=" + lat + "&lon=" + lon
    $.ajax({
        url: uvUrl,
        method: "GET"
    }).then(function (response) {
        var uvDex = response.value;
        var uvDexDisplay = $("<p>");
        var uvDexSpan = $("<span>");
        uvDexDisplay.text("UV Index: ");
        uvDexSpan.text(uvDex);
        uvDexSpan.attr("id", "uv");
        if (uvDex < 3) {
            uvDexSpan.attr("class", "UV1");
        }
        else if (uvDex > 3 && uvDex < 6) {
            uvDexSpan.attr("class", "UV2");
        }
        else if (uvDex > 6 && uvDex < 8) {
            uvDexSpan.attr("class", "UV3");
        }
        else if (uvDex > 8 && uvDex < 11) {
            uvDexSpan.attr("class", "UV4");
        }
        else {
            uvDexSpan.attr("class", "UV5");
        }
        uvDexDisplay.append(uvDexSpan);
        $("#output").append(uvDexDisplay);
    })
}
$("document").ready(function () {
    $("#search").on("click", function () {
        $("#output").empty();
        var Loc = $("#input").val()
        currentWeather(Loc);
        locBtn(Loc);
    });
    currentWeather("Houston");
});




