let rawData = [];
let chart;
function parseCSV(csvText) {
  return Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  }).data;
}

function groupById(data) {
  const grouped = {};
  data.forEach((row) => {
    if (!grouped[row.id]) grouped[row.id] = [];
    grouped[row.id].push(row);
  });
  return grouped;
}

function computeDelta(sortedData) {
  const result = [];
  for (let i = 1; i < sortedData.length; i++) {
    const prev = sortedData[i - 1];
    const curr = sortedData[i];
    result.push({
      timestamp: prev.timestamp,
      views: curr.views - prev.views,
      vote: curr.vote - prev.vote,
      alarm: curr.alarm - prev.alarm,
      like: curr.like - prev.like,
    });
  }
  return result;
}

function computeDailyDelta(sortedData) {
  const byDay = {};
  sortedData.forEach((row) => {
    const day = row.timestamp.slice(0, 8);
    if (!byDay[day] || row.timestamp > byDay[day].timestamp) {
      byDay[day] = row;
    }
  });

  const days = Object.keys(byDay).sort();
  const result = [];
  for (let i = 1; i < days.length; i++) {
    const prev = byDay[days[i - 1]];
    const curr = byDay[days[i]];
    result.push({
      timestamp: days[i],
      views: curr.views - prev.views,
      vote: curr.vote - prev.vote,
      alarm: curr.alarm - prev.alarm,
      like: curr.like - prev.like,
    });
  }
  return result;
}

function drawChart(timestamps, averageValues, selectedValues, metricKey) {
  const canvas = document.getElementById("chartCanvas");
  const ctx = canvas.getContext("2d");
  if (chart) chart.destroy();

  const metricLabels = {
    views: "조회수",
    vote: "추천",
    like: "선작",
    alarm: "알림",
  };

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: timestamps.map((ts) =>
        ts.length === 10
          ? ts
          : ts.slice(0, 4) +
            "/" +
            ts.slice(4, 6) +
            "/" +
            ts.slice(6, 8) +
            " " +
            ts.slice(8, 10) +
            "시"
      ),
      datasets: [
        {
          label: "전체 평균",
          data: averageValues,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderColor: "gray",
          backgroundColor: "rgba(128,128,128,0.1)",
        },
        selectedValues && {
          label: "선택된 소설",
          data: selectedValues,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderColor: "blue",
          backgroundColor: "rgba(0,0,255,0.1)",
        },
      ].filter(Boolean),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
      scales: {
        y: { beginAtZero: true },
        x: { title: { display: true, text: "시간대" } },
      },
      plugins: {
        tooltip: {
          mode: "nearest",
          callbacks: {
            title: (tooltipItems) => tooltipItems[0].label,
            label: (tooltipItem) =>
              `${metricLabels[metricKey]}: ${tooltipItem.formattedValue}`,
          },
        },
      },
    },
  });
}

function extractAndVisualize(selectedId, grouped, byDay = false) {
  const metric = document.getElementById("metricSelect").value;
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  const timestamps = [];
  const averageValues = [];
  const selectedValues = [];

  const tempMap = {};
  const counts = {};

  Object.values(grouped).forEach((group) => {
    if (group.length < 2) return;
    const sorted = group.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const deltas = byDay ? computeDailyDelta(sorted) : computeDelta(sorted);
    deltas.forEach((d) => {
      if ((start && d.timestamp < start) || (end && d.timestamp > end)) return;
      const ts = d.timestamp;
      if (!tempMap[ts]) {
        tempMap[ts] = 0;
        counts[ts] = 0;
      }
      tempMap[ts] += d[metric];
      counts[ts]++;
    });
  });

  const tsList = Object.keys(tempMap).sort();
  tsList.forEach((ts) => {
    timestamps.push(ts);
    averageValues.push(tempMap[ts] / counts[ts]);
  });

  if (selectedId && grouped[selectedId]) {
    const sorted = grouped[selectedId].sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp)
    );
    const deltas = byDay ? computeDailyDelta(sorted) : computeDelta(sorted);
    const map = new Map(
      deltas
        .filter(
          (d) =>
            (!start || d.timestamp >= start) && (!end || d.timestamp <= end)
        )
        .map((d) => [d.timestamp, d[metric]])
    );

    timestamps.forEach((ts) => {
      selectedValues.push(map.has(ts) ? map.get(ts) : null);
    });
  }

  drawChart(timestamps, averageValues, selectedValues, metric);
}

function setupDropdownByList(idTitleList, grouped) {
  const select = document.getElementById("novelSelect");
  idTitleList.forEach(({ id, title }) => {
    if (!grouped[id]) return;
    const option = document.createElement("option");
    option.value = id;
    option.textContent = title;
    select.appendChild(option);
  });
}

function setupEvents(grouped) {
  const handler = () => {
    const id = document.getElementById("novelSelect").value;
    const byDay = document.getElementById("dailyCheckbox").checked;
    extractAndVisualize(id, grouped, byDay);
  };

  document.getElementById("novelSelect").addEventListener("change", handler);
  document.getElementById("metricSelect").addEventListener("change", handler);
  document.getElementById("dailyCheckbox").addEventListener("change", handler);
  document.getElementById("startDate").addEventListener("input", handler);
  document.getElementById("endDate").addEventListener("input", handler);
}
async function init() {
  const [novelListRes, statsRes] = await Promise.all([
    fetch("novel_list.csv"),
    fetch("novel_stats.csv"),
  ]);

  const novelListText = await novelListRes.text();
  const statsText = await statsRes.text();

  const novelListParsed = Papa.parse(novelListText, {
    header: true,
    skipEmptyLines: true,
  }).data;

  const idTitleList = novelListParsed.map((row) => ({
    id: row.id,
    title: row.title.replace(/^"|"$/g, ""),
  }));

  rawData = parseCSV(statsText);
  const grouped = groupById(rawData);

  setupDropdownByList(idTitleList, grouped);
  setupEvents(grouped);
  extractAndVisualize("", grouped);

  $("#novelSelect").addClass("select2").select2({
    placeholder: "소설 제목을 검색하세요",
    allowClear: true,
    width: "400px",
  });
}

init();
