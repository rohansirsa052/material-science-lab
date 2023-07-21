const charts = {};
const totalSteps= 10;
const DATA_UPDATE_ANIMATION_DELAY = 600;

const temperature 
//in degree C

= [
  -60.5,
-60.5,
-50.7,
-50.7,
-40.3,
-40.3,
-20.2,
-20.2,
-10.5,
-10.5,
-0.1,
-0.1,
-0.1,
9.7,
10,
22.6,
22.6,
30.4,
29.4,
40.1,
39.8,
49.9,
50.2,
49.9,

];

const Impact_Energy
//Energy in Joules

= [
  5.4,
  2.3,
  6.3,
  7.8,
  5.6,
  8.1,
  5,
  7.4,
  9.5,
  11.1,
  15.6,
  13.2,
  10.7,
  13.1,
  11.3,
  16.8,
  22.6,
  21.3,
  26.2,
  26.8,
  31.4,
  28,
  31.3,
  34.7,
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