import * as d3 from "https://cdn.skypack.dev/d3@7"

const COLORS = [
    "#ffffff", 
    "#80ea87", 
    "#00d40e", 
    "#00ac30", 
    "#008351", 
    "#005a72", 
    "#004683", 
    "#003193"
];

let colorScale = d3.scaleQuantize()
                    .domain([0, 72])
                    .range(COLORS);

export default {
    chartContainer: (parentElement = "body") =>  d3.select(parentElement).append("svg"),
    getWidth: (element = {}) => {
        return Number(element.style("width").slice(0,-2));
    },
    getHeight: (element = {}) => {
        return Number(element.style("height").slice(0,-2));
    },
    addColorReferenceLegend: (container = {}, initialPixel = 0, margin = 0) => {
        let  ticksValues = [0, 9, 18, 27, 36, 45, 54, 63, 72];
        let heightWidth = (initialPixel - margin) / 8;
        let yScale = d3.scaleLinear([0, 72], [initialPixel, margin]);
        let yAxis = d3.axisLeft(yScale)
                        .tickValues(ticksValues)
                        .tickFormat(t => `${t}%`);
        container.append("g")
                    .attr("transform", `translate(${50}, 0)`)
                    .call(yAxis)
                    .selectAll("rect")
                    .data(ticksValues.filter(e => e <= 63))
                    .enter()
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", (d, i) => yScale(d) - heightWidth)
                    .attr("width", 20)
                    .attr("height", heightWidth)
                    .attr("stroke", "black")
                    .attr("fill", (d, i) => colorScale(d));
    }
}