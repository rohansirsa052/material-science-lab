const charts = {};
const schema = ["loadKN", "dialReading"];
const readingData = [
  [0, 0],
  [2.5, 6],
  [5, 14],
  [7.5, 20],
  [10, 29],
  [12.5, 35],
  [15, 43],
  [17.5, 52],
  [20, 60],
  [22.5, 68],
  [25, 78],
  [27.5, 85],
  [30, 94],
  [32.5, 102],
  [35, 112],
  [37.5, 122],
  [40, 132],
  [42.5, 140],
  [45, 150],
  [47.5, 161],
  [50, 174],
  [52.5, 186],
  [55, 198],
  [57.5, 212],
  [60, 230],
  [62.5, 244],
  [65, 262],
  [67.5, 286],
  [70, 324],
  [72.5, 367],
  [75, 405],
];

// x axis 
const dialReading = [0, 6, 12, 16, 22, 28, 34, 40, 47, 52, 58, 65, 73, 80, 87, 94, 102, 110, 118, 126, 135, 144, 155, 165, 176, 189, 201, 216, 232, 248, 268, 284];
// y axis
const loadKN = [0, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30, 32.5, 35, 37.5, 40, 42.5, 45, 46.5, 48, 49.5, 52.1, 53.5, 54, 55, 56.8, 57.5, 60, 62, 64.2, 65.5];

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
  let len = document.getElementById("step1Length").value;
  if (!len) {
    alert("Please enter the length in step 1.");
    return;
  }

  if (len < 35 || len > 40) {
    alert("Wrong readings! Please take your reading correctly via venier caliper. (Range must be in b/w 35 to 40 mm)");
    return;
  }

  sampleLength = len;

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step2");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 2;
}

function handleStep2() {
  let pane = document.getElementById("step2");
  let len = document.getElementById("step2Dia").value;
  if (!len) {
    alert("Please enter the diameter in step 2.");
    return;
  }

  if (len < 3 || len > 4) {
    alert("Wrong readings! Please take your reading correctly via venier caliper. (Range must be in b/w 3 to 4 mm)");
    return;
  }

  sampleDiameter = len;

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step3");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 3;
}

function handleStep3() {
  let pane = document.getElementById("step3");

  if (!utm || !utm.isActive()) {
    alert("Please take UTM machine from menu first!");
    return;
  }

  if (!utm.isSampleLoaded()) {
    alert("Please load the sample on the UTM machine first!");
    return;
  }

  //plot blank graph
  plotGraph(
    document.getElementById("outputGraphA").getContext("2d"),
    {
      labels: dialReading,
      datasets: [
        {
          data: [],
          borderColor: "#3e95cd",
          fill: false,
        },
      ],
    },
    "Dial Reading in mm",
    "Load in kN"
  );

  document.getElementById("btnNext").disabled = true;

  document.getElementById("startTest").addEventListener("click", (e) => {
    let tableBody = document.getElementById("testData");
    e.currentTarget.disabled = true;
    document.getElementById("btnNext").disabled = true;
    e.currentTarget.innerHTML = "Running...";

    utm.setConfig({
      yield_point: 10, // no yield point
      breaking_point: 0.65,
      finish_point: 0.7,
    });

    setTimeout(() => {
      utm.start(0.015, 1);
    }, 4000);

    let intr = setInterval(() => {
      if (currPos >= readingData.length) {
        clearInterval(intr);
        document.getElementById("startTest").disabled = false;
        document.getElementById("startTest").innerHTML = "Done";
        utm.stop();
        document.getElementById("btnNext").disabled = false;
        return;
      }

      tableBody.innerHTML += `
          <tr>
            <td>${readingData[currPos][0]}</td>
            <td>${readingData[currPos][1]}</td>
          </tr>
        `;
      currPos++;

      let progress1 = (loadKN.length / readingData.length) * currPos;
      plotGraph(
        document.getElementById("outputGraphA").getContext("2d"),
        {
          labels: dialReading,
          datasets: [
            {
              data: loadKN.slice(0, progress1),
              borderColor: "#3e95cd",
              fill: false,
            },
          ],
        },
        "Dial Reading in mm",
        "Load in kN"
      );
    }, 600);
  });

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step4");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 4;
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

  let next = document.getElementById("step6");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 6;
}

function handleStep6() {
  let pane = document.getElementById("step6");

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step7");
  next.classList.add("active");
  next.classList.remove("disabled");

  //last
  document.getElementById("btnNext").disabled = true;
  document.querySelector("#step7 .content").innerHTML = `
    <table>
      <tr>
        <td>Initial Length</td>
        <td>${sampleLength} mm</td>
      </tr>
      <tr>
        <td>Initial Diameter</td>
        <td>${sampleDiameter} mm</td>
      </tr>
      <tr>
        <td>Final Length</td>
        <td>~${sampleLength} mm</td>
      </tr>
      <tr>
        <td>Final Diameter</td>
        <td>~${sampleDiameter} mm</td>
      </tr>
    </table>
  `;
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
        legend: { display: false },
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
                max: Math.max(...dialReading),
              },
              // stacked: true,
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: labelY,
              },
              ticks: {
                beginAtZero: true,
                steps: 10,
                stepValue: 5,
                max: Math.max(...loadKN),
              },
            },
          ],
        },
      },
    });
  }
}
