import React, { useEffect, useRef, useContext, useState } from 'react';
import { RangeContext, TaskNameContext, StateContext, PatientContext } from '../GlobalContext';
import { Table, Button } from 'antd'; // Import the Table component


import * as d3 from 'd3';
import rawData from '../data/taskState_spent.csv';
import PatientDataTable from './PatientDataTable';



const SVG_WIDTH = 800;
const SVG_HEIGHT = 600;
const margin = {
    top: 90,
    right: 190,
    bottom: 40,
    left: 40
};
const width = SVG_WIDTH - margin.left - margin.right;
const height = SVG_HEIGHT - margin.top - margin.bottom;

const BoxPlot = ({ onPatientChange }) => {
    const chartRef = useRef(null);
    const range = useContext(RangeContext);
    const selectedTask = useContext(TaskNameContext);
    const selectedSate = useContext(StateContext);



    useEffect(() => {
        console.log("boxPlot: " + selectedSate);

        const svg = d3.select(chartRef.current);
        d3.select(chartRef.current).select('svg').remove();

        // Clear the container before rendering
        svg.selectAll("*").remove();


        svg.append("text")
            .text("Time spent boxplot")
            .attr("x", 10)
            .attr("y", 20)
            .attr("font-size", "1.5rem")
            .attr("font-weight", "bold");

        svg.append("text")
            .html(`The distribution of ${selectedSate} times in ${selectedTask} task
             between ${~~range[0]} tick and ${~~range[1]} tick.`)
            .attr("x", 10)
            .attr("y", 50)
            .attr("font-size", "1rem");



        // Read the data
        d3.csv(rawData, (d) => {
            if (d.task === selectedTask && d.state === selectedSate) {
                return { date: +d.start_tick, value: +d.ticks_spent, id: d.id, location: d.location, task: d.task };
            }
        }).then((data) => {
            // Filter the data by 'current_tick' values
            const filteredDate = data.filter((d) => +d.date >= range[0] && +d.date <= range[1]);
            const filteredValue = filteredDate.filter((d) => +d.value > 1);

            const values = filteredValue.map((d) => d.value); // Store the values in a separate variable
            //   const dates = filteredData.map((d) => d.date);
            //   console.log(dates);
            const sortedData = values.sort((a, b) => a - b);

            const median = d3.median(sortedData);
            const firstQuartile = d3.quantile(sortedData, 0.25);
            const thirdQuartile = d3.quantile(sortedData, 0.75);
            const interQuartileRange = thirdQuartile - firstQuartile;
            const minAbsolute = d3.min(sortedData);
            const minIQR = firstQuartile - interQuartileRange * 1.5;
            const min = (minIQR > minAbsolute) ? minIQR : minAbsolute;
            const maxAbsolute = d3.max(sortedData);
            const maxIQR = thirdQuartile + interQuartileRange * 1.5;
            const max = (maxIQR < maxAbsolute) ? maxIQR : maxAbsolute;


            const svgContainer = svg
                .attr("width", SVG_WIDTH)
                .attr("height", SVG_HEIGHT)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            const xScale = d3.scaleLinear()
                .domain([range[0], range[1]]) // Update the xScale domain
                .nice()
                .range([0, width]);

            const yScale = d3.scaleLinear()
                .domain([0, maxAbsolute + 1]) // Update the yScale domain
                .range([height, 0]);



            const xAxis = d3.axisBottom(xScale)
                .tickSize(-10)
                .tickPadding(10);

            const yAxis = d3.axisLeft(yScale)
                .tickSize(-10)
                .tickPadding(10);

            const groupAxis = svgContainer
                .append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(xAxis);

            const groupAxis_y = svgContainer
                .append("g")
                // .attr("transform", `translate(0, ${height})`)
                .call(yAxis);

            groupAxis.select("path")
                .attr("fill", "none")
                .attr("stroke", "#00000055")
                .attr("stroke-width", "1px");


            groupAxis_y.select("path")
                .attr("fill", "none")
                .attr("stroke", "#00000055")
                .attr("stroke-width", "1px");


            //x axis number
            groupAxis.selectAll("text")
                .attr("fill", "#00000088")
                .attr("stroke", "none")
                .style("font-weight", "bold")
                .style("font-size", "0.7rem");



            groupAxis_y.selectAll("text")
                .attr("fill", "#00000088")
                .attr("stroke", "none")
                .style("font-weight", "bold")
                .style("font-size", "0.7rem");


            svgContainer.append("line")
                .attr("x1", width / 2)
                .attr("x2", width / 2)
                .attr("y1", yScale(min))
                .attr("y2", yScale(max))
                .attr("stroke", "#443785")
                .attr("stroke-width", "4px");


            svgContainer.append("text")
                .attr("x", width / 2 - 20)
                .attr("y", yScale(min))
                .attr("text-anchor", "middle")
                .text("min")
                .attr("fill", "#443785")
                .attr("font-weight", "bold");

            svgContainer.append("text")
                .attr("x", width / 2 - 20)
                .attr("y", yScale(max))
                .attr("text-anchor", "middle")
                .text("max")
                .attr("fill", "#443785")
                .attr("font-weight", "bold");


            svgContainer.append("rect")
                .attr("x", width / 2 - width / 8)
                .attr("width", width / 4)
                .attr("y", yScale(thirdQuartile))
                .attr("height", yScale(firstQuartile) - yScale(thirdQuartile))
                .attr("fill", "#fff")
                .attr("stroke", "#443785")
                .attr("stroke-width", "4px");


            svgContainer.append("text")
                .attr("x", width / 2 - width / 8 - 20)
                .attr("y", yScale(firstQuartile))
                .attr("text-anchor", "middle")
                .text("q1")
                .attr("fill", "#443785")
                .attr("font-weight", "bold");

            svgContainer.append("text")
                .attr("x", width / 2 - width / 8 - 20)
                .attr("y", yScale(thirdQuartile))
                .attr("text-anchor", "middle")
                .text("q3")
                .attr("fill", "#443785")
                .attr("font-weight", "bold");

            svgContainer.append("line")
                .attr("x1", width / 2 - width / 8)
                .attr("x2", width / 2 + width / 8)
                .attr("y1", yScale(median))
                .attr("y2", yScale(median))
                .attr("stroke", "#443785")
                .attr("stroke-width", "4px");

            svgContainer.append("text")
                .attr("x", width / 2 - width / 8 - 40)
                .attr("y", yScale(median))
                .attr("text-anchor", "middle")
                .text("median")
                .attr("fill", "#443785")
                .attr("font-weight", "bold");



            svgContainer.selectAll("circle")
                .data(filteredDate)
                .enter()
                .append("circle")
                .attr("cx", (d) => xScale(d.date))
                .attr("cy", (d) => yScale(d.value))
                .attr("r", "6px")
                .attr("fill", (d) => {
                    if (d.value > maxIQR) {
                        return "red"; // Dot is red if greater than maxIQR
                    } else if (d.value > thirdQuartile) {
                        return "orange"; // Dot is orange if greater than thirdQuartile but less than maxIQR
                    } else {
                        return "#44378588"; // Default color for the dots
                    }
                })


            svgContainer.selectAll(".aux-line")
                .data(filteredValue)
                .enter()
                .append("line")
                .attr("class", "aux-line")
                .attr("x1", (d) => xScale(d.date))
                .attr("x2", (d) => xScale(d.date))
                .attr("y1", height)
                .attr("y2", (d) => yScale(d.value))
                .attr("stroke", "#00000033")
                .attr("stroke-width", "1px");

            svgContainer.selectAll(".aux-line-horizontal")
                .data(filteredValue)
                .enter()
                .append("line")
                .attr("class", "aux-line-horizontal")
                .attr("x1", 0)
                .attr("x2", (d) => xScale(d.date))
                .attr("y1", (d) => yScale(d.value))
                .attr("y2", (d) => yScale(d.value))
                .attr("stroke", "#00000033")
                .attr("stroke-width", "1px");


            // Add text "time" to the x-axis
            svgContainer.append("text")
                .attr("x", width)
                .attr("y", height + 30)
                .attr("text-anchor", "middle")
                .text("Time (tick)")
                .attr("fill", "#00000088")
                .attr("font-weight", "bold")
                .style("font-size", "1rem");

            // Add text to the y-axis
            svgContainer.append("text")
                .attr("x", 100)
                .attr("y", 5)
                .attr("text-anchor", "middle")
                .text(`${selectedSate} time (tick)`)
                .attr("fill", "#00000088")
                .attr("font-weight", "bold")
                .style("font-size", "1rem");





            const legendData = [
                { label: "Moderate Time", color: "#44378588" },
                { label: "Time Exceeds 75th Percentile", color: "orange" },
                { label: "Time Exceeds MaxIQR", color: "red" },
            ];

            // Create the legend SVG group
            const legendGroup = svgContainer.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${width + 10}, ${margin.top - 50})`);

            // Add the legend circles and labels
            const legendCircles = legendGroup.selectAll("circle")
                .data(legendData)
                .enter()
                .append("circle")
                .attr("cx", 0)
                .attr("cy", (d, i) => i * 25)
                .attr("r", "6px")
                .attr("fill", (d) => d.color);

            const legendLabels = legendGroup.selectAll("text")
                .data(legendData)
                .enter()
                .append("text")
                .attr("x", 10)
                .attr("y", (d, i) => i * 25 + 5)
                .attr("font-size", "0.8rem")
                .text((d) => d.label)
                .attr("fill", "#00000088");

            // Create the brush
            const brush = d3.brush()
                .extent([[0, 0], [width, height]])
                .on('end', brushed);

            // Append the brush to the svgContainer
            const brushGroup = svgContainer.append('g')
                .attr('class', 'brush')
                .call(brush);

            function brushed() {
                // Get the selection extent
                const selection = d3.event.selection;

                // If there is a selection, find the data points within the selection
                if (selection) {
                    // console.log(selection);
                    const selectedPatientData = filteredDate.filter(
                        (d) => xScale(d.date) >= selection[0][0] && xScale(d.date) <= selection[1][0] && yScale(d.value) >= selection[0][1] && yScale(d.value) <= selection[1][1]
                    );

                    // Log the selected data points to the console
                    // console.log(selectedData);
                    onPatientChange(selectedPatientData);

                    // You can do further processing with the selectedData if needed
                }
            }



        });

    }, [range, selectedTask, selectedSate]);



    return (
        <div
            style={{
                display: 'flex',
                marginTop: '10px', // Adjusted the top margin to move the chart and text closer
                flexDirection: 'column',
                justifyContent: 'start',
                alignItems: 'center',
                padding: '0px',
            }}
        >
            {/* Move the SVGs inside a wrapper div */}
            <div style={{ marginTop: '20px' }}> {/* Adjusted the top margin to move the chart closer */}
                {/* Replace container with svg */}
                <svg className="chart" ref={chartRef}></svg>
            </div>
            <ul style={{ textAlign: 'left', marginRight: '300px', fontFamily: 'Arial, sans-serif', fontStyle: 'italic',color: '#666666', opacity: '0.8' }}>
            <li>Max (MaxIQR): The upper bound to identify potential outliers.</li>
            <li>Q3 (Third Quartile): The 75th percentile of the data.</li>
            <li>Median: The middle value of the dataset.</li>
            <li>Q1 (First Quartile): The 25th percentile of the data.</li>
            
            <li>Min (MinIQR): The lower bound to identify potential outliers.</li>
            
        </ul>
        </div>
    );



};

export default BoxPlot;
