const charts = {};
const schema = ["loadKN", "extensometerA", "extensometerB", "average", "ivoryScale"];
const readingData = [
  [0, 0, 0, 0, 0],
  [2.5, 1, 2, 1.5, 0.5],
  [5, 2, 3, 2.5, 0.5],
  [7.5, 3, 4, 3.5, 0.5],
  [10, 4, 5, 4.5, 1],
  [12.5, 5, 6, 5.5, 1],
  [15, 7, 7, 7, 1],
  [17.5, 9, 7, 8, 1],
  [20, 10, 8, 9, 1.5],
  [22.5, 11, 10, 10.5, 1.5],
  [25, 12, 11, 11.5, 1.5],
  [27.5, 13, 12, 12.5, 2],
  [30, 14, 14, 14, 2],
  [32.5, 15, 15, 15, 2],
  [35, 16, 16, 16, 2.5],
  [38, 0, 0, 0, 4],
  [36, 0, 0, 0, 5],
  [35, 0, 0, 0, 6],
  [40, 0, 0, 0, 7.2],
  [42.5, 0, 0, 0, 9],
  [45, 0, 0, 0, 10.5],
  [47.5, 0, 0, 0, 12],
  [50, 0, 0, 0, 16],
  [52.5, 0, 0, 0, 18],
  [55, 0, 0, 0, 22],
  [57, 0, 0, 0, 28],
  [52.5, 0, 0, 0, 34],
  [50, 0, 0, 0, 38],
  [48, 0, 0, 0, 44],
];

const ivoryReadings = [0, 0.5, 1, 1.5, 2, 2.5, 4, 5, 6, 7.2, 9, 10.5, 12, 16, 18, 22, 28, 34, 38, 44];
const loadKN1 = [0, 5, 13.75, 22.5, 30, 35, 38, 36, 35, 40, 42.5, 45, 47.5, 50, 52.5, 55, 57, 52.5, 50, 48];

const extensometerReading = [0, 1, 2.5, 3, 4, 5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5, 14, 15.5, 16.5];
const loadKN2 = [0, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30, 32.5, 36, 38];

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
      labels: ivoryReadings,
      datasets: [
        {
          data: [],
          borderColor: "#3e95cd",
          fill: false,
        },
      ],
    },
    "Actuator Reading in mm",
    "Load in kN"
  );

  plotGraph(
    document.getElementById("outputGraphB").getContext("2d"),
    {
      labels: extensometerReading,
      datasets: [
        {
          data: [],
          borderColor: "#3e95cd",
          fill: false,
        },
      ],
    },
    "Extensometer Reading in div",
    "Load in kN"
  );

  document.getElementById("btnNext").disabled = true;

  document.getElementById("startTest").addEventListener("click", (e) => {
    let tableBody = document.getElementById("testData");
    e.currentTarget.disabled = true;
    document.getElementById("btnNext").disabled = true;
    e.currentTarget.innerHTML = "Running...";

    setTimeout(() => {
      utm.start(0.05, 1);
    }, 1000);

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
            <td>${readingData[currPos][2]}</td>
            <td>${readingData[currPos][3]}</td>
            <td>${readingData[currPos][4]}</td>
          </tr>
        `;
      currPos++;

      let progress1 = (loadKN1.length / readingData.length) * currPos;
      plotGraph(
        document.getElementById("outputGraphA").getContext("2d"),
        {
          labels: ivoryReadings,
          datasets: [
            {
              data: loadKN1.slice(0, progress1),
              borderColor: "#3e95cd",
              fill: false,
            },
          ],
        },
        "Ivory Scale Reading in mm",
        "Load in kN"
      );

      let progress2 = (loadKN2.length / readingData.length) * currPos;

      plotGraph(
        document.getElementById("outputGraphB").getContext("2d"),
        {
          labels: extensometerReading,
          datasets: [
            {
              data: loadKN2.slice(0, progress2),
              borderColor: "#3e95cd",
              fill: false,
            },
          ],
        },
        "Extensometer Reading in div",
        "Load in kN"
      );
    }, 650);
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
  let len = document.getElementById("step5Length").value;
  if (!len) {
    alert("Please enter the length in step 5.");
    return;
  }

  if (len < 38 || len > 40) {
    alert("Wrong readings! Please take your reading correctly via venier caliper. (Range must be in b/w 38 to 40mm)");
    return;
  }

  sampleFinalLength = len;

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step6");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 6;
}

function handleStep6() {
  let pane = document.getElementById("step6");
  let len = document.getElementById("step6Dia").value;

  if (!len) {
    alert("Please enter the diameter in step 6.");
    return;
  }

  if (len < 3 || len > 5) {
    alert("Wrong readings! Please take your reading correctly via venier caliper. (Range must be in b/w 3 to 5mm)");
    return;
  }

  sampleFinalDiameter = len;

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
        <td>${sampleFinalLength} mm</td>
      </tr>
      <tr>
        <td>Final Diameter</td>
        <td>${sampleFinalDiameter} mm</td>
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
                steps: 10,
                stepValue: 5,
                max: Math.max(...ivoryReadings),
              },
              stacked: true,
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
                max: Math.max(...loadKN1),
              },
            },
          ],
        },
      },
    });
  }
}
