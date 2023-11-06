import {
  tiempoArr,
  precipitacionArr,
  uvArr,
  temperaturaArr,
} from "./static_data.js";

let fechaActual = () => new Date().toISOString().slice(0, 10);

let cargarPrecipitacion = () => {
  //Obtenga la fecha actual
  let actual = fechaActual();

  //Defina un arreglo temporal vacío
  let datos = [];

  //Itere en el arreglo tiempoArr para filtrar los valores de precipitacionArr que sean igual con la fecha actual
  for (let index = 0; index < tiempoArr.length; index++) {
    const tiempo = tiempoArr[index];
    const precipitacion = precipitacionArr[index];

    if (tiempo.includes(actual)) {
      datos.push(precipitacion);
    }
  }

  //Con los valores filtrados, obtenga los valores máximo, promedio y mínimo
  let max = Math.max(...datos);
  let min = Math.min(...datos);
  let sum = datos.reduce((a, b) => a + b, 0);
  let prom = sum / datos.length || 0;

  //Obtenga la referencia a los elementos HTML con id precipitacionMinValue, precipitacionPromValue y precipitacionMaxValue
  let precipitacionMinValue = document.getElementById("precipitacionMinValue");
  let precipitacionPromValue = document.getElementById(
    "precipitacionPromValue"
  );
  let precipitacionMaxValue = document.getElementById("precipitacionMaxValue");

  //Actualice los elementos HTML con los valores correspondientes
  precipitacionMinValue.textContent = `Min ${min} [mm]`;
  precipitacionPromValue.textContent = `Prom ${
    Math.round(prom * 100) / 100
  } [mm]`;
  precipitacionMaxValue.textContent = `Max ${max} [mm]`;
};

let cargarFechaActual = () => {
  //Obtenga la referencia al elemento h6
  let coleccionHTML = document.getElementsByTagName("h6");

  let tituloH6 = coleccionHTML[0];
  //Actualice la referencia al elemento h6 con el valor de la función fechaActual()
  tituloH6.textContent = fechaActual();
};

let cargarOpenMeteo = () => {
  //URL que responde con la respuesta a cargar
  let URL =
    "https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m,precipitation_probability&daily=uv_index_max&timezone=auto";

  fetch(URL)
    .then((responseText) => responseText.json())
    .then((responseJSON) => {
      //Respuesta en formato JSON
      let plotRef = document.getElementById("plot1");
      let plotRef2 = document.getElementById("plot2");

      //Etiquetas del gráfico
      let labels = responseJSON.hourly.time;

      //Etiquetas de los datos
      let data = responseJSON.hourly.temperature_2m;
      let data2 = responseJSON.hourly.precipitation_probability;
      let data3 = responseJSON.daily.uv_index_max;

      //Objeto de configuración del gráfico
      let config = {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Temperature [2m]",
              data: data,
            },
            {
              label: "UV Index",
              data: data3,
            },
          ],
        },
      };
      let config2 = {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Precipatation probability",
              data: data2,
            },
          ],
        },
      };

      //Objeto con la instanciación del gráfico
      let chart1 = new Chart(plotRef, config);

      let chart2 = new Chart(plotRef2, config2);
    })
    .catch(console.error);
};

cargarPrecipitacion();
cargarFechaActual();
cargarOpenMeteo();

let parseXML = (responseText) => {
  // Parsing XML
  const parser = new DOMParser();
  const xml = parser.parseFromString(responseText, "application/xml");

  console.log(xml);
};

// Callback async
let selectListener = async (event) => {

    let selectedCity = event.target.value

    try {

        //API key
        let APIkey = '30e57d2739b39646ff3140fb778a011d'
        let url = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&mode=xml&appid=${APIkey}`

        let response = await fetch(url)
        let responseText = await response.text()
        
        await parseXML(responseText)

    } catch (error) {
        console.log(error)
    }

}

let loadForecastByCity = () => {
  //Handling event
  let selectElement = document.querySelector("select")
  selectElement.addEventListener("change", selectListener)
};

loadForecastByCity();


