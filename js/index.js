const charts = {};
const schema = ["loadKN", "dialReading"];
const readingData = [
  [0, 0],
  [3, 400],
  [6, 800],
  [9, 1200],
  [12, 1600],
  [16, 2000],
  [19, 2400],
  [22, 2800],
  [24, 3200],
  [27, 3600],
  [30, 4000],
  [33, 4400],
  [36, 4800],
  [39, 5200],
  [44, 5600],
  [50, 6000],
  [56, 6400],
  [62, 6800],
  [68, 7200],
  [74, 7600],
  [82, 8000],
  [93, 8400],
  [106, 8800],
  [120, 9200],
  [129, 9600],
  [139, 10000],
  [165, 11000],
  [196, 12000],
  [230, 13000],
  [270, 14000],
  [314, 15000],
  [370, 16000],
  [426, 17000],
  [480, 18000],
  [545, 19000],
  [613, 20000],
  [690, 21000],
  [756, 22000],
  [830, 23000],
  [900, 24000],
  [975, 25000],
  [1055, 26000],
  [1127, 27000],
  [1196, 28000],
];

// x axis
const dialReading = [
  0, 3, 6, 9, 12, 16, 19, 22, 24, 27, 30, 33, 36, 39, 44, 50, 56, 62, 68, 74, 82, 93, 106, 120, 129, 139, 165, 196, 230,
  270, 314, 370, 426, 480, 545, 613, 690, 756, 830, 900, 975, 1055, 1127, 1196,
];
// y axis
const loadKN = [
  0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 5600, 6000, 6400, 6800, 7200, 7600,
  8000, 8400, 8800, 9200, 9600, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000,
  22000, 23000, 24000, 25000, 26000, 27000, 28000,
];

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

  if (len < 7 || len > 10) {
    alert("Wrong readings! Please take your reading correctly via venier caliper. (Range must be in b/w 7 to 10 mm)");
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

  if (len < 5 || len > 6) {
    alert("Wrong readings! Please take your reading correctly via venier caliper. (Range must be in b/w 5 to 6 mm)");
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
      yield_point: 0.3,
      breaking_point: 0.25,
      finish_point: 0.2,
    });

    setTimeout(() => {
      utm.start(0.02, -1);
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
  let len = document.getElementById("step5Length").value;
  if (!len) {
    alert("Please enter the length in step 5.");
    return;
  }

  if (len < 8 || len > 9) {
    alert("Wrong readings! Please take your reading correctly via venier caliper. (Range must be in b/w 8 to 9mm)");
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

  if (len < 7 || len > 8) {
    alert("Wrong readings! Please take your reading correctly via venier caliper. (Range must be in b/w 7 to 8mm)");
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
        <td>~${sampleFinalLength} mm</td>
      </tr>
      <tr>
        <td>Final Diameter</td>
        <td>~${sampleFinalDiameter} mm</td>
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
