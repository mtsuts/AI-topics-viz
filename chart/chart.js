function forceGraph(nodes, params) {
  const container = d3.select(params.container)
  // define metrics

  const bounding = container.node().getBoundingClientRect()

  const metrics = {
    width: bounding.width,
    height: bounding.height,
    chartWidth: bounding.width,
    chartHeight: bounding.height
  }

  // create svg and append to container
  const svg = d3
    .select(".svg")
    .attr("width", metrics.width)
    .attr("height", metrics.height)


  // create g element, append to svg, create simulation
  const g = svg.append("g")
    .attr('width', metrics.chartWidth)
    .attr('height', metrics.chartHeight)

  // radius scale
  const rScale = d3
    .scaleLinear()
    .domain([
      d3.min(nodes.map((d) => d.amount)),
      d3.max(nodes.map((d) => d.amount)),
    ])
    .range([40, 100])

  // font size scale
  const fontSizeScale = d3.scaleLinear().domain([
    d3.min(nodes.map((d => d.amount))),
    d3.max(nodes.map((d) => d.amount))
  ]).range([10, 12])


  // create node g element
  const node = g
    .selectAll("g.node")
    .data(nodes)
    .join("g")
    .attr("class", (d) => `node ${d.message}`)
    .attr('opacity', 1)
    .attr('cursor', 'pointer')
    .attr('id', (d) => d.id)


  // draw node circle
  node
    .append("circle")
    .attr('class', (d) => `circle-node`)
    .attr("r", (d) => rScale(d.amount))
    .attr('fill', (d) => d.color)
    .attr('opacity', 0.3)

  // append text to node circle
  node
    .append("text")
    .attr("font-size", (d) => fontSizeScale(d.amount))
    .attr("text-anchor", "middle")
    .attr('class', 'quote-text')
    .attr("pointer-events", "none")
    .attr('dy', "0.35em")
    .attr('dx', 0)
    .attr('x', 0)
    .attr('fill', '#ffffff')
    .text((d) => d.terminology)
    .attr("text-anchor", "middle")
    .style("font-size", '16px')


  node.on("click", function (e, d) {
    onNodeClick(e, d)
  })

  // force graph simulation
  function forceSimul() {
    simulation = d3
      .forceSimulation(nodes)
      .force("center", d3.forceCenter(metrics.width / 2, metrics.height / 2))
      .force(
        "collision",
        d3
          .forceCollide()
          .radius((d) => rScale(d.amount) + 4)
          .iterations(10)
      )
      .force('charge', d3.forceManyBody().strength(40))
      .force("x", d3.forceX().strength(0.0008))
      .force("y", d3.forceY().strength(0.09))
      .on("tick", function ticked() {
        node.attr("transform", (d) => `translate(${d.x}, ${d.y})`)
      })
  }

  forceSimul()

  // handle circle node click event
  function onNodeClick(e, d) {
    // forceSimul()
    d3.selectAll('.circle-node').style('filter', `drop-shadow(0 0 1.2rem transparent)`).classed('click', false)
    quotesOpened(d)

    d3.select(`#${d.id}`)
      .select('.circle-node')
      .style('opacity', 1)
      .classed('click', true)
      .attr('r', (x) => rScale(x.amount))
      .style('filter', `drop-shadow(0 0 0.90rem ${d.color})`)

    d3.select('.quotes-section')
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1)
  }


  function quotesOpened(topic) {
    // quotes container
    const container = d3.select('#quotes')
    // quotes data
    const quotes = topic.data

    // apply styles to chosen node
    d3.select(`#${topic.id}`)
      .select('.circle-node')
      .style('opacity', 1)
      .classed('click', true)
      .attr('r', (x) => rScale(x.amount))
      .style('filter', `drop-shadow(0 0 0.90rem ${topic.color})`)

    // clean container before append new topic quotes
    container.html('')

    // append quotes data to container
    quotes.map((quote) => {


      // append quote container
      const quoteContainer = container
        .append("div")
        .attr('class', 'quote-container')

      quoteContainer.append('div')
        .html(`<div class='quote-container-text'> 
        <div class='quote-author'>  ${quote.person} <span> (${quote.role})</span>  </div>
        <div class='quote-text'> "${quote.quote}"</div> 
        <div class='quote-source'> 
        
        <a href=${quote.source} target='_blank'> 
        Read more 
<svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / External_Link"> <path id="Vector" d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke="#fffafa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
        </a>
        
        </div>
        </div>`)

    })
  }

  quotesOpened(nodes.find(d => d.terminology === "Creativity"))
}



