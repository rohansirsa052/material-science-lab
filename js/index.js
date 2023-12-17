const charts = {};
const totalSteps= 10;
const DATA_UPDATE_ANIMATION_DELAY = 600;

// const temperature = [1.06E+04, 1.56E+04, 1.61E+04, 2.22E+04, 2.50E+04, 3.78E+04, 5.54E+04, 7.22E+04, 1.09E+05, 1.09E+05, 1.85E+05, 1.90E+05, 3.54E+05, 4.61E+05, 8.31E+05, 9.36E+05, 1.42E+06, 1.69E+06, 2.71E+06, 3.64E+06, 5.20E+06, 8.84E+06, 1.55E+07, 2.97E+07, 6.60E+07, 9.72E+07, 1.91E+08, 3.57E+08, 4.65E+08, 7.69E+08, 1.35E+09, 3.00E+09, 3.38E+09, 5.26E+09, 7.72E+09
// ];

const temperature = [6.74E+03, 9.87E+03, 1.15E+04, 2.06E+04, 2.12E+04, 4.57E+04, 5.77E+04, 9.82E+04, 1.48E+05, 2.92E+05, 4.82E+05, 7.52E+05, 1.20E+06, 1.99E+06, 2.91E+06, 4.68E+06, 7.27E+06, 1.04E+07, 1.87E+07, 2.67E+07, 4.27E+07, 7.28E+07, 1.20E+08, 1.87E+08, 3.38E+08, 5.42E+08, 8.95E+08, 1.71E+09, 2.75E+09, 3.59E+09, 5.92E+09, 8.43E+09

];
//in degree C

// const Impact_Energy= [496, 491, 479, 473, 463, 454, 434, 424, 415, 399, 390, 375, 365, 343, 332, 330, 327, 314, 313, 321, 325, 314, 314, 316, 308, 327, 308, 322, 309, 318, 314, 311, 330, 317, 312
// ];

const Impact_Energy= [381, 354, 380, 338, 321, 304, 284, 278, 255, 242, 226, 229, 204, 196, 184, 184, 162, 162, 148, 162, 135, 134, 116, 120, 108, 111, 95, 94, 80, 86, 73, 61

];
// in mN

var currPos = 0;
var currentStepProgress = 1;
var sampleLength = 0;
var sampleDiameter = 0;
var sampleFinalLength = 0;
var sampleFinalDiameter = 0;

document.getElementById("step1").classList.remove("disabled");
window.refresh();

function handle() {
  eval(`handleStep${currentStepProgress}()`);
  window.refresh();
}

function handleStep1() {
  let pane = document.getElementById("step1");
  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step2");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 2;
}

function handleStep2() {
  let pane = document.getElementById("step2");

  if (!mit.isSampleLoaded()) {
    alert("Please load the sample on the machine first!");
    return;
  }

  pane.classList.add("done");
  pane.classList.remove("active");

  //plot blank graph init graphs
  plotGraph(
    document.getElementById("outputGraphA").getContext("2d"),
    {
      labels: temperature,
      datasets: [
        {
          data: [],
          borderColor: "#3e95cd",
          fill: false,
        },
      ],
    },
    "temperature (s)",
    "Penetration Depth (nm)"
  );

  document.getElementById("btnNext").disabled = true;

  document.getElementById("startTest").addEventListener("click", (e) => {
    let tableBody = document.getElementById("testData");
    // e.currentTarget.disabled = true;
    // document.getElementById("btnNext").disabled = true;
    // e.currentTarget.innerHTML = "Running...";

    mit.setConfig({
      yield_point: 0.3,
      breaking_point: 0.25,
      finish_point: 0.2,
    });

    
    setTimeout(() => {
      mit.start();
    }, 500);
  
  
  
     
    let intr = setInterval(() => {
      if (currPos >= totalSteps) {
        clearInterval(intr);
        document.getElementById("startTest").disabled = false;
        document.getElementById("startTest").innerHTML = "Done";
        mit.stop();
        document.getElementById("btnNext").disabled = false;
        return;
      }

      tableBody.innerHTML += `
            <tr>
              <td>${temperature[currPos]}</td>
              <td>${ Impact_Energy[currPos]}</td>
           
            </tr>
          `;
      currPos++;

      let progress1 = ( Impact_Energy.length / totalSteps) * currPos;
      plotGraph(
        document.getElementById("outputGraphA").getContext("2d"),
        {
          labels: temperature,
          datasets: [
            {
              yAxisID: "A",
              data:  Impact_Energy.slice(0, progress1),
              borderColor: "#3e95cd",
              fill: false,
              label: "Temperature",
            },
            // {
            //   yAxisID: "B",
            //   data: force.slice(0, progress1),
            //   borderColor: "brown",
            //   fill: false,
            //   label: "Force",
            // },
          ],
        },
        "Impact Energy  (J)",
        "Temperature (C)"
      );
    }, DATA_UPDATE_ANIMATION_DELAY);
  });

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step3");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 3;
}

function handleStep3() {
  let pane = document.getElementById("step3");

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step4");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 4;

  modal = new Modal({
    title: "Can you answer the questions?",
    body: [
      {
        page: 1,
        title: "In the Charpy impact test the specimen is kept as:?",
        options: ["Fixed end beam", "Simply supported beam", "Cantilever beam", " Overhanging beam"],
        correct: 2,
      },

      {
        page: 2,
        title: "For impact test, T1 in the schematic below correspond to (T indicates temperature)?",
        image: "images/QuestionsImages/fig4.png",
        options: ["T1 - FTP", " T1 - DTT", " T1 - FATT", "T1 - NDT"],
        correct: 1,
      },
    
      {
        page: 3,
        title: "In impact testing, Ductility Transition Temperature is the temperature at which the energy is: ",
      
        options: [" 20 J", "30 J", "10 J", "40 J"],
        correct: 1,
      },
    
      {
        page: 4,
        title: "In a hypothetical curve given below for impact testing, A might correspond to: ",
        image: "images/QuestionsImages/fig3.png",
        options: ["  Mild steel", "  Low carbon steel", "Chromium ", "Nickel"],
        correct: 4,
      },

          {
        page: 5,
        title: "Which of the following is correct? ",
    
        options: [" In Izod test, the specimen is kept horizontally", " The angle of the V-notch specimen is 60o", " In Charpy test, the specimen is kept horizontally", "The initial height of the pendulum is the impact energy"],
        correct: 3,
      },

      {
        page: 6,
        title: "Fracture-appearance transition temperature, FATT corresponds to?",

        options: ["  40 % cleavage fracture", " 50 % cleavage fracture", " 0 % cleavage fracture", "100 % cleavage fracture"],
        correct: 2,
      },
   
      {
        page: 7,
        title: "For impact test, T5 in the schematic below correspond to (T indicates temperature)",
        image: "images/QuestionsImages/fig4.png",
        options: ["  T5 - FTP", " T5 - DTT", " T5 - FATT", " T5 - NDT"],
        correct: 4,
      },



      {
        page: 8,
        title: "Fracture surfaces of the same alloy are shown below from impact tests conducted at three different temperatures (T1, T2 and T3). Which one of them is true?",
        image: "images/QuestionsImages/fig2.png",
        options: ["  T1>T3>T2", "T3>T2>T1", " T3>T1>T2", "T2>T3>T1"],
        correct: 1,
      }, 


      {
        page: 9,
        title: " In a hypothetical curve given below for impact testing, B might correspond to:",
        image: "images/QuestionsImages/fig3.png",
        options: ["  Copper", " Nickel", "Mild steel", " Aluminum "],
        correct: 3,
      },

      {
        page: 10,
        title: " Which of the following is correct? ",
  
        options: [" In Izod test, the pendulum hits on the opposite surface to that containing notch", "The impact energy is related to difference between initial and final height", "In Charpy test, the pendulum hits on the same surface that contains notch", "In India, we predominantly use Izod impact test"],
        correct: 2,
      },
   

      {
        page: 11,
        title: "The strain rates in impact test are: ",
        options: ["  Slightly higher than tensile tests", " lower than tensile tests", "Almost similar to tensile tests", " Much higher than tensile tess"],
        correct: 4,
      },



    ],
    onClose: handleStep4,
  });
  modal.show();
}

function handleStep4() {
  let pane = document.getElementById("step4");

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step5");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 5;
}

function handleStep5() {
  let pane = document.getElementById("step5");

  pane.classList.add("done");
  pane.classList.remove("active");

  // let next = document.getElementById("step6");
  // next.classList.add("active");
  // next.classList.remove("disabled");

  document.getElementById("btnNext").disabled = true;
  document.getElementById("btnNext").innerText = "Done";
  // currentStepProgress = 6;
}

function plotGraph(graphCtx, data, labelX, labelY) {
  let chartObj = charts[graphCtx.canvas.id];
  if (chartObj) {
    chartObj.config.data.labels = data.labels;
    chartObj.config.data.datasets = data.datasets;
    chartObj.update();
  } else {
    charts[graphCtx.canvas.id] = new Chart(graphCtx, {
      type: "line",
      data: data,
      options: {
        responsive: true,
        animation: false,
        scaleOverride: true,
        // legend: { display: false },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: labelX,
              },
              ticks: {
                beginAtZero: true,
                steps: 20,
                stepValue: 10,
                max: Math.max(...temperature),
              },
              // stacked: true,
            },
          ],
          yAxes: [
            {
              display: true,
              position: "left",
              id: "A",
              scaleLabel: {
                display: true,
                labelString: labelY,
              },
              ticks: {
                beginAtZero: true,
                steps: 10,
                stepValue: 5,
                 max: Math.max(... Impact_Energy),
                //max: 2000,
              },
            },
            // {
            //   display: true,
            //   position: "right",
            //   id: "B",
            //   scaleLabel: {
            //     display: true,
            //     labelString: "Force in mN",
            //   },
            //   ticks: {
            //     beginAtZero: true,
            //     steps: 10,
            //     stepValue: 5,
            //     // max: Math.max(... Impact_Energy),
            //     max: 2000,
            //   },
            // },
          ],
        },
      },
    });
  }
}