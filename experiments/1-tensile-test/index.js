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

  if (len < 8 || len > 10) {
    alert("Wrong readings! Please take your reading correctly via venier caliper. (Range must be in b/w 8 to 10)");
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

  if (len < 0.5 || len > 1.5) {
    alert("Wrong readings! Please take your reading correctly via venier caliper. (Range must be in b/w 0.5 to 1.5)");
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

  let graphArea = document.getElementById("outputGraphA");

  let ivoryReadings = [0, 0.5, 1, 1.5, 2, 2.5, 4, 5, 6, 7.2, 9, 10.5, 12, 16, 18, 22, 28, 34, 38, 44];
  let loadKN = [0, 5, 13.75, 22.5, 30, 35, 38, 36, 35, 40, 42.5, 45, 47.5, 50, 52.5, 55, 57, 52.5, 50, 48];

  plotGraph(
    graphArea,
    {
      labels: ivoryReadings,
      datasets: [
        {
          data: loadKN,
          borderColor: "#3e95cd",
          fill: false,
        },
      ],
    },
    "Ivory Scale Reading in mm",
    "Load in kN"
  );

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

  let graphAreaB = document.getElementById("outputGraphB");

  let loadKN = [0, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30, 32.5, 36, 38];
  let extensometerReading = [0, 1, 2.5, 3, 4, 5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5, 14, 15.5, 16.5];

  plotGraph(
    graphAreaB,
    {
      labels: extensometerReading,
      datasets: [
        {
          data: loadKN,
          borderColor: "#3e95cd",
          fill: false,
        },
      ],
    },
    "Extensometer Reading in div",
    "Load in kN"
  );

  currentStepProgress = 6;
}

function handleStep6() {
  let pane = document.getElementById("step6");

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step7");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 7;
}

function handleStep7() {
  let pane = document.getElementById("step7");
  let len = document.getElementById("step7Length").value;
  if (!len) {
    alert("Please enter the length in step 7.");
    return;
  }

  if (len < 8.5 || len > 11) {
    alert("Wrong readings! Please take your reading correctly via venier caliper. (Range must be in b/w 8.5 to 11)");
    return;
  }

  sampleFinalLength = len;

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step8");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 8;
}

function handleStep8() {
  let pane = document.getElementById("step8");
  let len = document.getElementById("step8Dia").value;

  if (!len) {
    alert("Please enter the diameter in step 8.");
    return;
  }

  if (len < 0.4 || len > 1.5) {
    alert("Wrong readings! Please take your reading correctly via venier caliper. (Range must be in b/w 0.5 to 1.5)");
    return;
  }

  sampleFinalDiameter = len;

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step9");
  next.classList.add("active");
  next.classList.remove("disabled");

  //last
  document.getElementById("btnNext").disabled = true;
  document.querySelector("#step9 .content").innerHTML = `
    <table>
      <tr>
        <td>Initial Length</td>
        <td>${sampleLength * 10} mm</td>
      </tr>
      <tr>
        <td>Initial Diameter</td>
        <td>${sampleDiameter * 10} mm</td>
      </tr>
      <tr>
        <td>Final Length</td>
        <td>${sampleFinalLength * 10} mm</td>
      </tr>
      <tr>
        <td>Final Diameter</td>
        <td>${sampleFinalDiameter * 10} mm</td>
      </tr>
    </table>
  `;
}

function plotGraph(element, data, labelX, labelY) {
  const graphCtx = element.getContext("2d");
  const myChart = new Chart(graphCtx, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      legend: { display: false },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: labelX,
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
          },
        ],
      },
    },
  });
}
