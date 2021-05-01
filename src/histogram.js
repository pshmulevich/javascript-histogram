//----------Histogram Section--------------------------------------
/**
 * Draws the histogram via the barchart
 */
const drawHistogram = () => {
  const inputValue = document.getElementById("dataInput").value;
  const inputArray = parseInput(inputValue);
  const { bucketMap, rangeOfValues, bucketwidth } = makeBuckets(inputArray);

  const values = [];
  // transfer data from the map to an array
  bucketMap.forEach((value, key, map) => {
    // console.log(`${key} => ${value}`);
    values.push({ key, value });
  });

  drawBarChart(values, rangeOfValues, bucketwidth);
};

/**
 * Splits input string on commas, converts to numbers, then sorts
 * @param String inputValue
 */
const parseInput = (inputValue) => {
  const inputData = inputValue.split(",");
  const numericData = inputData.map((element) => parseInt(element, 10));
  // Sorted alphabetically unless a sorter function is provided
  // See: https://stackoverflow.com/a/1063027
  const sortedData = numericData.sort((a, b) => a - b);
  // console.log(sortedData);
  return sortedData;
};

//========================================================
// FUNCTION to replace the original makeBuckets function
//========================================================
const makeBuckets = (inputArray) => {
  const bucketMap = new Map();
  const minElement = inputArray[0];
  const maxElement = inputArray[inputArray.length - 1];
  // console.log("minElement", minElement);
  // console.log("maxElement", maxElement);
  const rangeOfValues = maxElement - minElement;
  // const bucketwidth = Math.ceil(rangeOfValues / 10);
  const bucketwidth = Math.floor(Math.sqrt(rangeOfValues)); 
  // const bucketwidth = 10; //hardcoded at 10

  // console.log("bucketWidth:", bucketwidth);

  //------Section for prefilling sub buckets with 0's --------------
  const minKey = Math.floor(minElement / bucketwidth);
  const maxKey = Math.floor(maxElement / bucketwidth);

  for (var i = minKey; i <= maxKey; i++) {
    bucketMap.set(i, 0); //pre-fill buckets with 0's
  }
//------------------------------------------------------------------
  inputArray.forEach((element) => {
    // Compute bucket key -> if element = 9, bucket 1
    const bucketKey = Math.floor(element / bucketwidth);
    // console.log("bucketKey:", bucketKey);

    //value at that key in the bucket
    const value = bucketMap.get(bucketKey);
    const existingQuantity = value ? value : 0;
    bucketMap.set(bucketKey, existingQuantity + 1);
  });
  // console.log("BucketMap:", bucketMap);
  return { bucketMap, rangeOfValues, bucketwidth};
};

//========================================================
//========================================================

/**
 * Creates a randomized array meant as default values for the barchart
 * @param int size - number of random generated elements
 * @param int max - largest element
 */
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
/**
 * Renders the svg element
 * @param int svgHeight
 */
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

/**
 * Renders the rectangle bar for each 'bucket'
 * @param Object svg
 * @param int x
 * @param int y
 * @param int width
 * @param int height
 * @param Object keyValue
 */
const renderRect = (svg, x, y, width, height, keyValue, bucketwidth) => {
  const rect = document.createElementNS(SVG_NAMESPACE, "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  svg.appendChild(rect);

  // Title appears on hover
  const title = document.createElementNS(SVG_NAMESPACE, "title");
  const bucketStart = keyValue.key * bucketwidth;
  const bucketEnd = bucketStart + bucketwidth;
  title.innerHTML = `Bucket (${bucketStart} -> ${bucketEnd}), size ${keyValue.value}`;
  rect.append(title);
  return rect;
};
/**
 * Draws the barchart
 * @param Object [] keyValues
 * @param int rangeOfValues
 */
const drawBarChart = (keyValues, rangeOfValues, bucketwidth) => {
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
    minChartWidth / (Math.sqrt(rangeOfValues) + 1)
  );

  const rectWidth = Math.max(minComputedRectWidth, minRectWidth);
  // For each element render a rectangle bar
  keyValues.forEach((keyValue, index) => {

    // Normalize the values for the svg height
    const rectHeight = keyValue.value * scaleCoef;
    const x = rectWidth * index;
    const y = verticalOffset - rectHeight; // Because chart inverted
    renderRect(svg, x, y, rectWidth, rectHeight, keyValues[index], bucketwidth);
  });
};
//------------------------Barchart end--------------------------------

const inputFieldElement = document.getElementById("dataInput");
// Sets up an onchange event handler for the input field
inputFieldElement.onchange = drawHistogram;
// Generates a random array for input field
inputFieldElement.value = generateRandomArray(1000, 100);
// Draw a histogram from default filler data
drawHistogram();
