import builderChart from "./builderChart.js";

const showChoroplethChart = (educationData, countyData) => {
    Promise.all([
        fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"),
        fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
    ]).then(response => Promise.all(response.map(e => e.json())))
    .then(data => {
        const svg = builderChart.chartContainer("main");
        const HEIGHT = builderChart.getHeight(svg);
        const PADDING = 100;
        builderChart.addColorReferenceLegend(svg, HEIGHT - PADDING, PADDING);
        // add color legend

    });
}

document.addEventListener('DOMContentLoaded', () => {
    const educationDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
    const countyDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
    showChoroplethChart(educationDataUrl, countyDataUrl);
});