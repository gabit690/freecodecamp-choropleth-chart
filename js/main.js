import builderChart from "./builderChart.js";

const showChoroplethChart = (educationDataUrl, countyDataUrl) => {
    Promise.all([
        fetch(educationDataUrl),
        fetch(countyDataUrl)
    ]).then(response => Promise.all(response.map(e => e.json())))
    .then(data => {
        builderChart.addTitle("header h1", "united states educational attainment");
        builderChart.addDescription("header", "percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)");
        const svg = builderChart.chartContainer("main");
        const HEIGHT = builderChart.getHeight(svg);
        const PADDING = 100;
        builderChart.addCounties(svg, data);
        builderChart.addColorReferenceLegend(svg, HEIGHT - PADDING, PADDING);
        builderChart.addTooltip();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const educationDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
    const countyDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
    showChoroplethChart(educationDataUrl, countyDataUrl);
});