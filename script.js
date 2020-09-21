const tooltip = document.getElementById("tooltip");

async function run() {
  const kickResp = await fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
  );
  const kickstarters = await kickResp.json();

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  var width = ($(window).width() <= 1560 ? $(window).width() : 1560) - 100,
    height = $(window).height() - 180,
    xPadding = 40,
    yPadding = 40,
    xyrPadding = 40;
    console.log(width)
  // barWidth = width / data.length;

  var svg = d3
    .select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const treemap = d3
    .treemap()
    .size([width, height])
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
      Genre: ${category}<br/>
      Gross: $ ${Math.round((value/1000000 + Number.EPSILON) * 100) / 100} Million`;

      

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
    .attr("style", "font-size: 6px")
    .attr("x", 2)
    .attr("y", (d, i) => 8 + i * 8)

    .text((d) => d);

  const categories = root
    .leaves()
    .map((d) => d.data.category)
    .filter((e, i, arr) => arr.indexOf(e) === i);
  console.log(categories);

  const blockSize = 20;
  const legendWidth = width-xPadding-4;
  const legendHeight = (blockSize * 2);
  const steps = width / categories.length;

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
    .attr('x',  ((_, i)=> i*steps+10))
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
    .attr('x', ((_, i)=> i*steps+35))
    .attr('y', (blockSize + 4))
    //.attr('y', (_, i)=>i*(blockSize+1)+25)
    .text(d=>d)
}

run();
