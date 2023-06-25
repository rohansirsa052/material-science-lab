const charts = {};
const DATA_UPDATE_ANIMATION_DELAY = 600;
// in seconds
const time = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
];

// in nm
const penetrationDepth = [
  49, 192, 300, 387, 473, 542, 628, 659, 725, 785, 839, 887, 940, 987, 1040, 1095, 1189, 1193, 1237, 1278, 1326, 1406,
  1444, 1491, 1494, 1529, 1568, 1608, 1674, 1712, 1738, 1751, 1750, 1754, 1760, 1763, 1767, 1769, 1773, 1774, 1769,
  1754, 1743, 1732, 1719, 1704, 1689, 1679, 1664, 1646, 1634, 1621, 1606, 1595, 1577, 1561, 1541, 1525, 1507, 1488,
  1473, 1453, 1434, 1411, 1387, 1364, 1331, 1290, 1287, 1220, 1093, 845, 646, 501,
];

// in mN
const force = [
  7, 43, 77, 109, 143, 175, 209, 227, 261, 293, 327, 359, 393, 425, 459, 494, 557, 560, 592, 626, 660, 724, 756, 790,
  793, 827, 859, 893, 956, 991, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 982, 947, 912, 881, 846,
  814, 780, 746, 714, 680, 648, 614, 579, 547, 513, 481, 447, 412, 381, 346, 315, 280, 246, 214, 180, 148, 114, 79, 77,
  45, 11, 1, 0, 0,
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
      labels: time,
      datasets: [
        {
          data: [],
          borderColor: "#3e95cd",
          fill: false,
        },
      ],
    },
    "Time (s)",
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

    return;

    let totalSteps = force.length;
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
              <td>${time[currPos]}</td>
              <td>${penetrationDepth[currPos]}</td>
              <td>${force[currPos]}</td>
            </tr>
          `;
      currPos++;

      let progress1 = (penetrationDepth.length / totalSteps) * currPos;
      plotGraph(
        document.getElementById("outputGraphA").getContext("2d"),
        {
          labels: time,
          datasets: [
            {
              yAxisID: "A",
              data: penetrationDepth.slice(0, progress1),
              borderColor: "#3e95cd",
              fill: false,
              label: "Penetration Depth",
            },
            {
              yAxisID: "B",
              data: force.slice(0, progress1),
              borderColor: "brown",
              fill: false,
              label: "Force",
            },
          ],
        },
        "Penetration Depth (nm)",
        "Time (s)"
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
        title: "This is sample question 1?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: 0,
      },
      {
        page: 2,
        title: "What does point U indicates in the graph?",
        image: "images/stress-strain-curve2.jpg",
        options: ["Tensile Strength", "Yield Strength", "Ultimate Tensile Strength", "Plastic Strength"],
        correct: 2,
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
                max: Math.max(...time),
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
                // max: Math.max(...penetrationDepth),
                max: 2000,
              },
            },
            {
              display: true,
              position: "right",
              id: "B",
              scaleLabel: {
                display: true,
                labelString: "Force in mN",
              },
              ticks: {
                beginAtZero: true,
                steps: 10,
                stepValue: 5,
                // max: Math.max(...penetrationDepth),
                max: 2000,
              },
            },
          ],
        },
      },
    });
  }
}
