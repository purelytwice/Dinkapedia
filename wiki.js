const stateData = {
  "northern-bahr-el-ghazal": { name: "Northern Bahr el Ghazal", children: [] },
  "western-bahr-el-ghazal": { name: "Western Bahr el Ghazal", children: [] },
  "warrap": { name: "Warrap", children: [] },
  "lakes": { name: "Lakes", children: [] },
  "unity": { name: "Unity", children: [] },
  "upper-nile": { name: "Upper Nile", children: [] },
  "jonglei": { name: "Jonglei", children: [] },
  "western-equatoria": { name: "Western Equatoria", children: [] },
  "central-equatoria": { name: "Central Equatoria", children: [] },
  "eastern-equatoria": { name: "Eastern Equatoria", children: [] }
};

const stateOrder = Object.keys(stateData);
const markers = document.querySelectorAll(".state-marker");
const networkContainer = document.getElementById("networkContainer");
const legend = document.getElementById("mapLegend");

if (legend) {
  legend.innerHTML = stateOrder
    .map((key, i) => `<li>${i + 1}. ${stateData[key].name}</li>`)
    .join("");
}

markers.forEach(marker => {
  marker.addEventListener("click", () => {
    markers.forEach(m => m.classList.remove("active"));
    marker.classList.add("active");

    const stateKey = marker.getAttribute("data-state");
    renderNetwork(stateKey);
  });
});

function renderNetwork(stateKey) {
  const state = stateData[stateKey];

  if (!state) {
    networkContainer.innerHTML = `<p class="network-placeholder">No data yet for this state.</p>`;
    return;
  }

  if (!state.children || state.children.length === 0) {
    networkContainer.innerHTML = `
      <p class="network-placeholder">${state.name}: clan data coming soon.</p>
    `;
    return;
  }

  const width = 800;
  const height = 500;
  const centerX = width / 2;
  const centerY = height / 2;

  let svgParts = [];

  function drawNode(x, y, label) {
    svgParts.push(`<circle cx="${x}" cy="${y}" r="6"></circle>`);
    svgParts.push(`<text x="${x}" y="${y - 12}">${label}</text>`);
  }

  function drawLine(x1, y1, x2, y2) {
    svgParts.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>`);
  }

  function layout(node, x, y, angleStart, angleEnd, radius, depth) {
    drawNode(x, y, node.name);

    const children = node.children || [];
    if (children.length === 0 || depth > 3) return;

    const angleStep = (angleEnd - angleStart) / children.length;

    children.forEach((child, i) => {
      const childAngleStart = angleStart + i * angleStep;
      const childAngleEnd = childAngleStart + angleStep;
      const midAngle = (childAngleStart + childAngleEnd) / 2;

      const childX = x + radius * Math.cos(midAngle);
      const childY = y + radius * Math.sin(midAngle);

      drawLine(x, y, childX, childY);
      layout(child, childX, childY, childAngleStart, childAngleEnd, radius * 0.7, depth + 1);
    });
  }

  layout(state, centerX, centerY, 0, 2 * Math.PI, 150, 0);

  networkContainer.innerHTML = `
    <svg id="networkSvg" viewBox="0 0 ${width} ${height}" width="100%" height="500">
      ${svgParts.join("")}
    </svg>
  `;
}