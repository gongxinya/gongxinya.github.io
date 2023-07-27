import React, { useEffect, useRef, useContext } from 'react';
import { RangeContext } from '../GlobalContext';
import * as d3 from 'd3';
import rawData from '../data/BedState.csv';

const SVG_WIDTH = 350;
const SVG_HEIGHT = 130;
const margin = { top: 40, right: 25, bottom: 30, left: 50 };
const width = 330 - margin.left - margin.right;
const height = 110 - margin.top - margin.bottom;


const HeatmapChart = ({ time }) => {
    const svgRef = useRef(null);
    const range = useContext(RangeContext);

    useEffect(() => {
        // Remove the existing SVG element
        d3.select(svgRef.current).select('svg').remove();

        // append the svg object to the body of the page
        const svg = d3
            .select(svgRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        console.log("selectedRange: " + range[1]);

        // Read the data
        d3.csv(rawData).then(rawData => {
            const data = rawData.filter((d) => d.current_tick == time);
            // Labels of row and columns -> unique identifier of the column called 'location' and 'id'
            const myGroups = d3.map(rawData, d => d.location).keys();
            const myVars = d3.map(rawData, d => d.id).keys();

            // Build X scales and axis:
            const x = d3
                .scaleBand()
                .range([0, width])
                .domain(myVars)
                .padding(0.05);
            svg
                .append("g")
                .style("font-size", 12)
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).tickSize(0))
                .select(".domain")
                .remove();

            // Build Y scales and axis:
            const y = d3
                .scaleBand()
                .range([height, 0])
                .domain(myGroups)
                .padding(0.05);
            svg
                .append("g")
                .style("font-size", 15)
                .call(d3.axisLeft(y).tickSize(0))
                .select(".domain")
                .remove();

            // Build color scale
            const myColor = d3
                .scaleOrdinal()
                .domain(["False", "True"])
                .range(["#42A5F5", "#FF5252"]);



            // create a tooltip
            const tooltip = d3
                .select(svgRef.current)
                .append('div')
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px");

            // create a text element for displaying the tooltip
            const text = svg.append("text")
                .attr("class", "tooltip-text")
                .style("opacity", 0)
                .attr("x", 0)
                .attr("y", 0)
                .attr("dy", "-1.2em")
                .style("text-anchor", "start");

            // Three functions that change the tooltip when the user hovers/moves/leaves a cell
            const mouseover = function (d) {
                tooltip.style("opacity", 1);
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1);
            };
            const mousemove = function (event, d) {
                const dataObj = d3.select(this).data()[0];
                const tooltipText = `State: ${dataObj.state}\nPatient: ${dataObj.patient_id}`;
                const [mouseX, mouseY] = [event.pageX, event.pageY];
                text
                    .text(tooltipText)
                    .attr("x", mouseX + 10)
                    .attr("y", mouseY)
                    .style("opacity", 1);
            };

            const mouseleave = function (d) {
                text.style("opacity", 0);
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 0.8);
            };

            // Add the squares
            svg
                .selectAll("rect")
                .data(data, d => d.location + ":" + d.id)
                .enter()
                .append("rect")
                .attr("x", d => x(d.id))
                .attr("y", d => y(d.location))
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .style("fill", d => myColor(d.occupied))
                .style("stroke-width", 4)
                .style("stroke", "none")
                .style("opacity", 0.8)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);

        });
    }, [time]);


    return (
        <div>
            <h3>
                Bed Allocation <span style={{fontSize: '14px', fontFamily: 'Arial, sans-serif', fontWeight: 'lighter'}}>(Current tick: {time})</span>
                </h3>
            <svg width={SVG_WIDTH} height={SVG_HEIGHT} ref={svgRef}></svg>
        </div>
    );
};

export default HeatmapChart;
