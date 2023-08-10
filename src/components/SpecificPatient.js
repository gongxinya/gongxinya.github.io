import React, { useEffect, useRef, useContext } from "react";
import * as d3 from "d3";
import { PatientIdContext } from '../GlobalContext';
import rawData from '../data/PatientLog.csv';

const SVG_WIDTH = 1500;
const SVG_HEIGHT = 300;
const margin = { top: 40, right: 140, bottom: 50, left: 100 };
const width = SVG_WIDTH - margin.left - margin.right;
const height = SVG_HEIGHT - margin.top - margin.bottom;

const PulseScatterChart = () => {
    const svgRef = useRef(null);
    const selectedPatientId = useContext(PatientIdContext);

    useEffect(() => {
        d3.select(svgRef.current).select('svg').remove();

        const svg = d3
            .select(svgRef.current)
            .append('svg')
            .attr('width', SVG_WIDTH)
            .attr('height', SVG_HEIGHT)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        d3.csv(rawData, (d) => {
            return {
                id: d.id,
                tick: +d.current_tick,
                task: d.task,
                state: d.state,
                bed: d.bed,
                nurse: d.Assigned_nurse,
                clinician: d.Assigned_clinician,
                location: d.location,
            };
        }).then((data) => {
            data.sort((a, b) => a.tick - b.tick);
            const filteredData = data.filter((d) => d.id === selectedPatientId && d.task);


            const x = d3.scaleLinear().domain([d3.min(filteredData, (d) => d.tick), d3.max(filteredData, (d) => d.tick)]).range([0, width]);
            const y = d3.scaleBand().domain(filteredData.map((d) => d.task)).range([height, 0]).padding(0.1);


            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).tickFormat(d3.format("d")));

            // Add gray horizontal grid lines
            svg.append("g")
                .call(d3.axisLeft(y).tickSize(-width).tickFormat("").ticks(filteredData.length))
                .selectAll(".tick line")
                .attr("stroke-opacity", 0.3)  // Adjust the opacity of the grid lines

            const timeDisplay = svg.append("text")
                .attr("class", "time-display")
                .attr("x", width)
                .attr("y", 0)
                .attr("text-anchor", "end")
                .attr("dy", "-1em")
                .style("font-size", "12px")
                .style("fill", "#333");

            svg.append("g").call(d3.axisLeft(y))
                .selectAll("text")
                .style("font-size", "12px");

            const scatter = svg.selectAll("circle")
                .data(filteredData)
                .enter()
                .append("circle")
                .attr("cx", (d) => x(d.tick))
                .attr("cy", (d) => y(d.task) + 15)
                .attr("r", 4) // Set the radius of the circles
                .attr("fill", (d) => (d.state === "current_task" ? "#4696db" : "#ff3c00")) // Set the fill color of the circles based on state
                .on("mouseover", (d) => {
                    console.log(d)
                    timeDisplay.text(`Time: ${d.tick}; Location: ${d.location}; Bed: ${d.bed}; Nurse: ${d.nurse}; Clinician: ${d.clinician}`);
                })
                .on("mouseout", () => {
                    timeDisplay.text("");
                });

            // Add title
            const title = svg
                .append("text")
                .attr("class", "title")
                .attr("dy", "0.35em")
                .style("font-size", "16px")  // Increase font size
                .style("font-weight", "bold") // Make the font bold
                .style("fill", "#333") // Change font color
                .text(`Selected Patient: ${selectedPatientId}`)
                .attr("transform", `translate(${width / 2 - 200}, ${-20})`);

            // Add text "time" to the x-axis
            svg.append("text")
                .attr("x", width + 30)
                .attr("y", height + 30)
                .attr("text-anchor", "middle")
                .text("Time (tick)")
                .attr("fill", "#00000088")
                .attr("font-weight", "bold")
                .style("font-size", "1rem");


            // Add text to the y-axis
            svg.append("text")
                .attr("x", 20)
                .attr("y", -5)
                .attr("text-anchor", "middle")
                .text("Task")
                .attr("fill", "#00000088")
                .attr("font-weight", "bold")
                .style("font-size", "1rem");

            //add legend
            const legend = svg
                .append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${width + 20}, ${0})`);

            // Add red legend
            legend
                .append("rect")
                .attr("x", 0)
                .attr("y", -10)
                .attr("width", 15)
                .attr("height", 15)
                .style("fill", "#ff3c00");

            legend
                .append("text")
                .attr("x", 20)
                .attr("y", -3)
                .attr("dy", "0.35em")
                .style("font-size", "12px")
                .text("Waiting")
                .attr("class", "legend-text");

            // Add blue legend
            legend
                .append("rect")
                .attr("x", 0)
                .attr("y", 25)
                .attr("width", 15)
                .attr("height", 15)
                .style("fill", "#4696db");

            legend
                .append("text")
                .attr("x", 20)
                .attr("y", 33)
                .attr("dy", "0.35em")
                .style("font-size", "12px")
                .text("Task in Progress")
                .attr("class", "legend-text");


        });
    }, [selectedPatientId]);

    return <svg width={SVG_WIDTH} height={SVG_HEIGHT} ref={svgRef} />;
};

export default PulseScatterChart;
