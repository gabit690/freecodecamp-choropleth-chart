import * as d3 from "https://cdn.skypack.dev/d3@7"

const COLORS = [
    "#c0f5c3", 
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

let getCountyEducationData = (fip = 0, educationalData = []) => {
    let countyData = {};
    let educationalDataLength = educationalData.length;
    for (let index = 0; index < educationalDataLength; index++) {
        if(educationalData[index].fips === fip) {
            countyData = educationalData[index];
            break;
        }
    }
    return countyData;
}

const addMouseOverEvent = (target = {}, mousePosition = [0, 0], data = "") => {
    d3.select("#tooltip")
        .attr("data-education", target.getAttribute("data-education"))
        .style("display", "block")
        .style("top", `${mousePosition[1] - 40}px`)
        .style("left", `${mousePosition[0]}px`);
    d3.select("#tooltip p")
        .text(data);
};

const addMouseOutEvent = (target = {}) => {
    d3.select("#tooltip")
        .style("display", "none");
};

export default {
    chartContainer: (parentElement = "body") =>  d3.select(parentElement).append("svg"),
    getWidth: (element = {}) => {
        return Number(element.style("width").slice(0,-2));
    },
    getHeight: (element = {}) => {
        return Number(element.style("height").slice(0,-2));
    },
    addTitle: (parentElement = "body", content = "my title") => {
        d3.select(parentElement)
            .attr("id", "title")
            .text(content);
    },
    addDescription: (parentElement = "body", content = "my description") => {
        d3.select(parentElement)
            .append("h2")
            .attr("id", "description")
            .text(content);
    },
    addColorReferenceLegend: (container = {}, initialPixel = 0, margin = 0) => {
        let  ticksValues = [0, 9, 18, 27, 36, 45, 54, 63, 72];
        let heightWidth = (initialPixel - margin) / 8;
        let yScale = d3.scaleLinear([0, 72], [initialPixel, margin]);
        let yAxis = d3.axisRight(yScale)
                        .tickValues(ticksValues)
                        .tickFormat(t => `${t}%`);
        container.append("g")
                    .attr("id", "legend")
                    .attr("transform", `translate(${1000}, 0)`)
                    .call(yAxis)
                    .selectAll("rect")
                    .data(ticksValues.filter(e => e <= 63))
                    .enter()
                    .append("rect")
                    .attr("x", -20)
                    .attr("y", d => yScale(d))
                    .attr("width", 20)
                    .attr("height", 0)
                    .attr("stroke", "black")
                    .attr("fill", d => colorScale(d))
                    .transition()
                    .delay((d, i) => i * 100)
                    .duration(150)
                    .attr("height", heightWidth)
                    .attr("transform", `translate(0, ${-heightWidth})`);
    },
    addCounties: (container = {}, data = []) => {
        const path = d3.geoPath();
        const counties = topojson.feature(data[1], data[1].objects.counties);
        let mappingData = counties.features.map(element => {
            return {
                feature: element,
                education: getCountyEducationData(element.id, data[0])
            };
        });
        container.selectAll('path')
           .data(mappingData)
           .enter()
           .append('path')
           .attr("class", "county")
           .attr("data-fips", d => d.education.fips)
           .attr("data-education", d => d.education.bachelorsOrHigher)
           .attr('d', d => path(d.feature))
           .attr("fill", d => colorScale(d.education.bachelorsOrHigher))
           .on("mouseover", (event, d) => {
                let data = `${d.education.area_name}, ${d.education.state}: ${d.education.bachelorsOrHigher}%`;
                addMouseOverEvent(event.target, [event.clientX, event.clientY], data);
           })
           .on("mouseout", (event) => addMouseOutEvent(event.target));
    },
    addTooltip: () => {
        d3.select("main")
            .append("div")
            .attr("id", "tooltip")
            .attr("data-education", 0)
            .append("p")
            .style("text-transform", "capitalize")
            .text("data-education");
    }
}