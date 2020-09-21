const tooltip = document.getElementById("tooltip");

async function run() {
  const kickResp = await fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
  );
  const kickstarters = await kickResp.json();

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  var width = $(window).width() - 100,
    height = $(window).height() - 280,
    xPadding = 40,
    yPadding = 40,
    xyrPadding = 40;
    console.log(width)
  // barWidth = width / data.length;

  var svg = d3
    .select("#container")
    .append("svg")
    .attr("width", width-xPadding-4)
    .attr("height", height + yPadding + xyrPadding);

  const treemap = d3
    .treemap()
    .size([width + xPadding + xyrPadding, height + yPadding + xyrPadding])
    .padding(1);

  const root = d3.hierarchy(kickstarters).sum((d) => d.value);

  treemap(root);

  const cell = svg
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

  const tile = cell
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("id", (d) => d.data.id)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill", (d) => color(d.data.category))
    .on("mousemove", (d, item) => {
      const { name, category, value } = item.data;
      tooltip.style.left = d.pageX - xyrPadding * 2 + "px";
      tooltip.style.top = d.pageY - xyrPadding * 2.5 + "px";
      tooltip.innerHTML = `Name: ${name}<br/>
      Category: ${category}<br/>
      Pledges: ${value}`;

      tooltip.setAttribute("data-value", value);
    })
    .on("mouseover", () => (tooltip.style.visibility = "visible"))
    .on("mouseout", () => (tooltip.style.visibility = "hidden"));

  cell
    .append("text")
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    // d.data.name.split(/(?=[A-Z][^A-Z])/g)
    .enter()
    .append("tspan")
    .attr("style", "font-size: 8px")
    .attr("x", 2)
    .attr("y", (d, i) => 8 + i * 10)

    .text((d) => d);

  const categories = root
    .leaves()
    .map((d) => d.data.category)
    .filter((e, i, arr) => arr.indexOf(e) === i);
  console.log(categories);

  const blockSize = 20;
  const legendWidth = 150 * categories.length;
  const legendHeight = (blockSize * 2);

  const legend = d3.selectAll('body')
    .append('svg')
    .attr('id', 'legend')
    .attr('width', legendWidth)
    .attr('height', legendHeight);

  legend.selectAll('rect')
    .data(categories)
    .enter()
    .append('rect')
    .attr('class', 'legend-item')
    .attr('fill', d => color(d))
    .attr('x',  ((_, i)=> i*150+10))
    .attr('y', (blockSize /2 ))
    // .attr('y', ((_, i)=> i* (blockSize+1)+10))
    .attr('width', blockSize)
    .attr('height', blockSize);

  legend.append('g')
    .selectAll('text')
    .data(categories)
    .enter()
    .append('text')
    .attr('fill', 'black')
    .attr('x', ((_, i)=> i*150+35))
    .attr('y', (blockSize + 4))
    //.attr('y', (_, i)=>i*(blockSize+1)+25)
    .text(d=>d)
}

run();
// fetch(
//   "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
// )
//   .then((res) => res.json())
//   .then((res) => {
//     console.log(res);
//     createGraph(
//       res.map((r) => [
//         new Date(1970, 0, 1, 0, r.Time.split(":")[0], r.Time.split(":")[1]),
//         r.Year,
//         r.Doping,
//         r.Name,
//         r.Nationality,
//       ])
//     );
//   });

// function createGraph(data) {
//   console.log(data);
//   var width = $(window).width() - 480,
//     height = $(window).height() - 180,
//     xPadding = 60,
//     yPadding = 40,
//     xyrPadding = 40,
//     barWidth = width / data.length;

//   var xScale = d3
//     .scaleLinear()
//     .domain([d3.min(data, (d) => d[1] - 1), d3.max(data, (d) => d[1] + 1)])
//     .range([xPadding, width + xPadding]);

//   var timeFormat = d3.timeFormat("%M:%S");

//   var yScale = d3
//     .scaleTime()
//     .domain([d3.min(data, (d) => d[0]), d3.max(data, (d) => d[0])])
//     .range([yPadding, height + yPadding]);

//   var svg = d3
//     .select("body")
//     .append("svg")
//     .attr("width", width + xPadding + xyrPadding)
//     .attr("height", height + yPadding + xyrPadding);

//   svg
//     .selectAll("dot")
//     .data(data)
//     .enter()
//     .append("circle")
//     .attr("class", "dot")
//     .attr("data-xvalue", (d) => d[1])
//     .attr("data-yvalue", (d) => d[0])
//     .attr("r", 6)
//     .attr("cx", (d) => xScale(d[1]))
//     .attr("cy", (d) => yScale(d[0]) + yPadding - xyrPadding)
//     .attr("fill", d => d[2] === '' ? 'blue' : 'red')
//     .attr("fill-opacity", "50%")
//     .attr("stroke", "black")
//     .on("mousemove", (d, item) => {
//       tooltip.style.left = d.pageX + (xyrPadding / 2) + "px";
//       tooltip.style.top = d.pageY - xyrPadding + "px";
//       tooltip.innerHTML = `
//       Name: ${item[3]} ${item[4]? `(${item[4]})` : ``}<br/>
//       Time: ${item[0].getMinutes()}:${item[0].getSeconds()} Year: ${item[1]}<br/>
//       <small><em>${item[2] ? "&ldquo;"+item[2]+"&rdquo;" : ''}</small>`;

//       tooltip.setAttribute("data-year", item[1]);
//     })
//     .on("mouseover", () => (tooltip.style.visibility = "visible"))
//     .on("mouseout", () => (tooltip.style.visibility = "hidden"));

//   var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

//   var xAxisGroup = svg
//     .append("g")
//     .attr("transform", `translate(0, ${height + xyrPadding})`)
//     .attr("id", "x-axis")
//     .call(xAxis);

//   var yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

//   var yAxisGroup = svg
//     .append("g")
//     .attr("transform", `translate(${xPadding}, -${yPadding - xyrPadding})`)
//     .attr("id", "y-axis")
//     .call(yAxis);
// }
