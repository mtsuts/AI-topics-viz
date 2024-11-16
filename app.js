document.addEventListener("DOMContentLoaded", init)

function init() {
  d3.json('data/data.json').then(res => {
    const data = res.map((d, i) => {
      const label = labelsData.find((label) => label.topic === d.topic)
      return {
        ...d, 
        id: getRandomId(),
        message: d.topic,
        amount: d.data.length, 
        color: label.background_color
      }
    })
    const container = {
      container: ".svg-div",
    }

    forceGraph(data, container)

  })
}






