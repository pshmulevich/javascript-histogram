//----------Histogram Section--------------------------------------
const drawHistogram = () => {
  const inputValue = document.getElementById("dataInput").value;
  const inputArray = parseInput(inputValue);
  const buckets = makeBuckets(inputArray);

  //traverses map, displays key and value
  const values = [];
  // transfer data from the map to an array
  buckets.forEach((value, key, map) => {
    // console.log(`${key} => ${value}`);
    values.push({ key, value });
  });

  // const values = buckets.values;
  drawBarChart(values);
};

const parseInput = (inputValue) => {
  const inputData = inputValue.split(",");
  const numericData = inputData.map((element) => parseInt(element, 10));

  // Sorted alphabetically unless a sorter function is provided
  // See: https://stackoverflow.com/a/1063027
  const sortedData = numericData.sort((a, b) => a - b);
  // console.log(sortedData);

  return sortedData;
};

const makeBuckets = (inputArray) => {
  const bucketMap = new Map();
  const minElement = inputArray[0];
  const maxElement = inputArray[inputArray.length - 1];
  // console.log("minElement", minElement);
  // console.log("maxElement", maxElement);
  for (var i = minElement; i <= maxElement; i++) {
    bucketMap.set(i, 0); //pre-fill buckets with 0's
  }
  inputArray.forEach((element) => {
    bucketMap.set(element, bucketMap.get(element) + 1);
  });
  return bucketMap;
};

const generateRandomArray = (size, max) => {
  //see: https://stackoverflow.com/a/52327785
  return Array.from({ length: size }, () => Math.floor(Math.random() * max));
};
//----------Histogram End--------------------------------------

//---------Barchart Section------------------------------------
// See: https://css-tricks.com/how-to-make-charts-with-svg/
// Used the pattern but made it dynamic

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const renderSvg = (svgHeight, svgWidth) => {
  const svg = document.createElementNS(SVG_NAMESPACE, "svg");
  svg.setAttribute("class", "svg-container");
  const svgParent = document.getElementById("svg-parent");
  if (svgParent.childNodes[0]) {
    svgParent.removeChild(svgParent.childNodes[0]);
  }
  svgParent.appendChild(svg);
  return svg;
};

const renderG = (svg) => {
  const g = document.createElementNS(SVG_NAMESPACE, "g");
  g.setAttribute("class", "bar");
  svg.appendChild(g);
  return g;
};

const renderRect = (g, x, y, width, height, keyValue) => {
  const rect = document.createElementNS(SVG_NAMESPACE, "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("tooltip", "test");
  g.appendChild(rect);

  // Title appears on hover
  const title = document.createElementNS(SVG_NAMESPACE, "title");
  title.innerHTML = `Freq of ${keyValue.key}: ${keyValue.value}`;
  rect.append(title);
  return rect;
};

const drawBarChart = (keyValues) => {
  // console.log("values: ", keyValues);
  const svgHeight = 250;
  const svgWidth = 600;
  const svg = renderSvg(svgHeight, svgWidth);

  // Find max value to normalize the bar height to fit into fixed height chart
  const maxValue = keyValues.reduce((max, element) => {
    const value = element.value;
    return max > value ? max : value;
  }, 0);

  const scaleCoef = svgHeight / maxValue; //coef larger if height bigger
  const verticalOffset = scaleCoef * maxValue;
  // Normalize the values for the svg height
  const normalizedValues = keyValues.map((keyValue) => {
    // console.log(Math.floor(keyValue.value * scaleCoef));
    return Math.floor(keyValue.value * scaleCoef);
  });

  normalizedValues.forEach((value, index) => {
    const g = renderG(svg);
    const rectWidth = 20;
    const rectHeight = value;
    const x = rectWidth * index;
    const y = verticalOffset - value; // Because chart inverted

    renderRect(g, x, y, rectWidth, rectHeight, keyValues[index]);
  });
};
//------------------------Barchart end--------------------------------

const inputFieldElement = document.getElementById("dataInput");
// Sets up an onchange event handler for the input field
inputFieldElement.onchange = drawHistogram;
// Generates a random array for input field
inputFieldElement.value = generateRandomArray(100, 30);
// Draw a histogram from default filler data
drawHistogram();
