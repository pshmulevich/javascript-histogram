//----------Histogram Section--------------------------------------
const drawHistogram = () => {
  const inputValue = document.getElementById("dataInput").value;
  const inputArray = parseInput(inputValue);
  const { bucketMap, rangeOfValues } = makeBuckets(inputArray);

  //traverses map, displays key and value
  const values = [];
  // transfer data from the map to an array
  bucketMap.forEach((value, key, map) => {
    // console.log(`${key} => ${value}`);
    values.push({ key, value });
  });

  drawBarChart(values, rangeOfValues);
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

// Creates more buckets than might ever be filled.
// done because we do not want to skip buckets (render all)
const makeBuckets = (inputArray) => {
  const bucketMap = new Map();
  const minElement = inputArray[0];
  const maxElement = inputArray[inputArray.length - 1];
  // console.log("minElement", minElement);
  // console.log("maxElement", maxElement);
  const rangeOfValues = maxElement - minElement;
  for (var i = minElement; i <= maxElement; i++) {
    bucketMap.set(i, 0); //pre-fill buckets with 0's
  }
  inputArray.forEach((element) => {
    bucketMap.set(element, bucketMap.get(element) + 1);
  });
  return { bucketMap, rangeOfValues };
};

const generateRandomArray = (size, max) => {
  //see: https://stackoverflow.com/a/52327785
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * max) - max / 2
  );
};
//----------Histogram End--------------------------------------

//---------Barchart Section------------------------------------
// See: https://css-tricks.com/how-to-make-charts-with-svg/
// Used the pattern but made it dynamic
const minChartWidth = 1000;
const maxRectWidth = 40;
const minRectWidth = 2;
const svgHeight = 250;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const renderSvg = (svgHeight) => {
  const svg = document.createElementNS(SVG_NAMESPACE, "svg");
  svg.setAttribute("height", svgHeight);
  svg.setAttribute("class", "svg-container");
  const svgParent = document.getElementById("svg-parent");
  if (svgParent.childNodes[0]) {
    svgParent.removeChild(svgParent.childNodes[0]);
  }
  svgParent.appendChild(svg);
  return svg;
};

const renderRect = (svg, x, y, width, height, keyValue) => {
  const rect = document.createElementNS(SVG_NAMESPACE, "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  svg.appendChild(rect);

  // Title appears on hover
  const title = document.createElementNS(SVG_NAMESPACE, "title");
  title.innerHTML = `Freq of ${keyValue.key}: ${keyValue.value}`;
  rect.append(title);
  return rect;
};

const drawBarChart = (keyValues, rangeOfValues) => {
  // console.log("values: ", keyValues);
  const svg = renderSvg(svgHeight);

  // Find max value to normalize the bar height to fit into fixed height chart
  const maxValue = keyValues.reduce((max, element) => {
    const value = element.value;
    return max > value ? max : value;
  }, 0);

  const scaleCoef = svgHeight / maxValue; //coef larger if height bigger
  const verticalOffset = scaleCoef * maxValue;

  // console.log("rangeOfValues:", rangeOfValues);
  const minComputedRectWidth = Math.min(
    maxRectWidth,
    minChartWidth / (rangeOfValues + 1)
  );
  keyValues.forEach((keyValue, index) => {
    const rectWidth = Math.max(minComputedRectWidth, minRectWidth);
    // Normalize the values for the svg height
    const rectHeight = keyValue.value * scaleCoef;
    const x = rectWidth * index;
    const y = verticalOffset - rectHeight; // Because chart inverted

    renderRect(svg, x, y, rectWidth, rectHeight, keyValues[index]);
  });
};
//------------------------Barchart end--------------------------------

const inputFieldElement = document.getElementById("dataInput");
// Sets up an onchange event handler for the input field
inputFieldElement.onchange = drawHistogram;
// Generates a random array for input field
inputFieldElement.value = generateRandomArray(100000, 200);
// Draw a histogram from default filler data
drawHistogram();
