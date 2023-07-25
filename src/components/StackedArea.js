import React, { useEffect, useRef, useState, useContext } from 'react';
import { RangeContext, TaskNameContext } from '../GlobalContext';
import * as d3 from 'd3';
import rawData from '../data/task_count.csv';
import { QuestionCircleFilled } from '@ant-design/icons';


const SVG_WIDTH = 1500;
const SVG_HEIGHT = 360;
const margin = { top: 40, right: 160, bottom: 50, left: 100 };
const width = SVG_WIDTH - margin.left - margin.right;
const height = SVG_HEIGHT - margin.top - margin.bottom;

const StackedAreaChart = ({ onTaskChange }) => {
    const chartRef = useRef(null);
    const tooltipRef = useRef(null); // Reference to the tooltip element
    const verticalLineRef = useRef(null);
    const bubbleRef = useRef(null);




    const range = useContext(RangeContext);
    const [selectedAreaIndex, setSelectedAreaIndex] = useState(null);




    useEffect(() => {
        // Remove the existing SVG element
        d3.select(chartRef.current).select('svg').remove();
        const renderStackedDiagram = (data) => {
            // Filter the data by 'current_tick' values
            const filteredData = data.filter(
                (d) => +d.current_tick >= range[0] && +d.current_tick <= range[1]
            );

            // List of groups = header of the csv files
            const keys = data.columns.slice(1);

            // Format the data
            filteredData.forEach((d) => {
                d.current_tick = +d.current_tick;
                keys.forEach((key) => {
                    d[key] = +d[key];
                });
            });


            const svg = d3.select(chartRef.current);

            const chart = svg.select('.chart');




            // Add X axis
            const x = d3
                .scaleLinear()
                .domain(d3.extent(filteredData, (d) => d.current_tick))
                .range([0, width]);


            // Update the X axis
            chart.select('.x-axis').call(d3.axisBottom(x).ticks(5));

            // Add X-axis label
            chart.selectAll('.x-axis-label').remove(); // Remove existing label if any
            chart
                .append('text')
                .attr('class', 'x-axis-label')
                .attr('x', width) // Position the label in the middle of the x-axis
                .attr('y', height + 20) // Position the label below the x-axis
                .style('text-anchor', 'middle') // Center the text horizontally
                .text('Time (tick)'); // The text for the x-axis label

            // Add Y axis
            const y = d3
                .scaleLinear()
                .domain([0, d3.max(filteredData, (d) => d3.sum(keys, (key) => d[key]))])
                .range([height, 0]);

            // Update the Y axis
            chart.select('.y-axis').call(d3.axisLeft(y));

            // Add Y-axis label
            chart.selectAll('.y-axis-label').remove(); // Remove existing label if any
            chart
                .append('text')
                .attr('class', 'y-axis-label')
                .attr('x', 70) // Position the label in the middle of the x-axis
                .attr('y', -10) // Position the label below the x-axis
                .style('text-anchor', 'middle') // Center the text horizontally
                .text('Number of patients'); // The text for the x-axis label

            // Color palette
            const color = d3
                .scaleOrdinal()
                .domain(keys)
                .range([
                    d3.rgb(220, 119, 81),
                    d3.rgb(235, 160, 114),
                    d3.rgb(220, 168, 91),
                    d3.rgb(235, 201, 103),
                    d3.rgb(136, 181, 108),
                    d3.rgb(153, 197, 180),
                    d3.rgb(152, 189, 203),
                    d3.rgb(173, 152, 215),
                ]);

            // Stack the data
            const stackedData = d3.stack().keys(keys)(filteredData);

            // Show the areas
            const areas = chart.selectAll('.area').data(stackedData);

            areas
                .enter()
                .append('path')
                .attr('class', 'area')
                .merge(areas)
                // .style('fill', (d, i) => (selectedAreaIndex !== null && selectedAreaIndex === i ? 'rgba(255, 255, 0, 1)' : color(d.key)))
                .style('fill', (d, i) => (selectedAreaIndex !== null && selectedAreaIndex !== i
                    ? `rgba(${color(d.key).r}, ${color(d.key).g}, ${color(d.key).b}, 0.2)`
                    : color(d.key)))

                .attr('d', d3.area().x((d, i) => x(d.data.current_tick)).y0((d) => y(d[0])).y1((d) => y(d[1])))
                .on('mouseover', function (d, i) {
                    setSelectedAreaIndex(i);

                })
                .on('mouseout', function () {
                    areas.style('opacity', 1);  // Restore opacity of all areas
                    setSelectedAreaIndex(null);
                })
                .on('click', (d) => {
                    // console.log(d.key);
                    onTaskChange(d.key);
                });

            areas.exit().remove();


            // Get or create the vertical line using the useRef
            let verticalLine = verticalLineRef.current;
            let bubble = bubbleRef.current;

            // Create a vertical dotted line using the <line> element
            if (!verticalLine) {
                verticalLine = svg.select('.chart').append('line')
                    .attr('class', 'vertical-line')
                    .attr('y1', 0)
                    .attr('y2', height)
                    .style('stroke', 'black')
                    .style('stroke-width', '1px')
                    .style('stroke-dasharray', '5,5')
                    .style('opacity', 0);

                verticalLineRef.current = verticalLine;
            }

            // Create a bubble to display the x-axis value
            if (!bubble) {
                bubble = svg
                    .select('.chart')
                    .append('circle')
                    .attr('class', 'bubble')
                    .attr('r', 4) // Set the radius of the bubble
                    .style('fill', 'white') // Set the fill color of the bubble
                    .style('stroke', 'black') // Set the stroke color of the bubble
                    .style('stroke-width', '2px') // Set the stroke width of the bubble
                    .style('opacity', 0); // Initially hide the bubble

                bubbleRef.current = bubble;
            }

            // Show the tooltip
            const tooltip = d3.select(tooltipRef.current);

            svg.on('mousemove', function () {
                const mouseXPosition = d3.mouse(this)[0] - 110; // Get the x-coordinate of the mouse pointer within the SVG

                // Constrain the mouse position within the range of the x-axis
                const constrainedX = Math.max(0, Math.min(width, mouseXPosition));

                // Calculate the corresponding x-axis value based on the constrained position
                const xValue = x.invert(constrainedX);

               
     
                // Update the position and visibility of the vertical line
                verticalLine
                    .attr('x1', constrainedX)
                    .attr('x2', constrainedX)
                    .style('opacity', 1);

                // Update the position and visibility of the bubble
                bubble.attr('cx', constrainedX).attr('cy', height).style('opacity', 1);


                // // Calculate the height of the tooltip relative to the bottom of the chart
                // const tooltipHeight = 30; // Adjust this value to set the distance from the bottom of the chart
                // const tooltipTop = height - tooltipHeight;

                // Show the tooltip with the x-axis value
                tooltip
                    .style('left', `${d3.event.pageX - 240}px `)
                    .style('top', -350)
                    .style('visibility', 'visible')
                    .html(`Time: ${~~xValue} tick`);


            });

            svg.on('mouseout', function () {
                // Hide the vertical line and tooltip when the mouse leaves the SVG area
                verticalLine.style('opacity', 0);
                tooltip.style('visibility', 'hidden');
            });

            // Legend
            const legend = svg.select('.legend');
            let legendItems = legend.selectAll('.legend-item').data(keys);

            // Append new legend items
            const legendItemsEnter = legendItems.enter().append('g').attr('class', 'legend-item').attr('transform', (_, i) => `translate(0, ${i * 20})`);

            legendItemsEnter
                .append('rect')
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', color); // Use the color scale for the legend

            legendItemsEnter.append('text').attr('x', 25).attr('y', 10).text((d) => d);

            // Merge enter and update selections
            legendItems = legendItemsEnter.merge(legendItems);



        };

        // Load and parse the CSV data
        d3.csv(rawData).then((data) => {
            renderStackedDiagram(data);
        });
    }, [range, selectedAreaIndex]);


    return (
        <div>

            <svg width={SVG_WIDTH} height={SVG_HEIGHT} ref={chartRef}>


                <g className="chart" transform={`translate(${margin.left},${margin.top})`}>
                    <g className="x-axis" transform={`translate(0,${height})`} />
                    <g className="y-axis" />
                </g>
                <g className="legend" transform={`translate(${width + margin.left + 10}, ${margin.top})`} />
            </svg>
            <div
                ref={tooltipRef}
                id="tooltip"
                style={{ position: 'relative', visibility: 'hidden' }}
            ></div>
        </div>
    );
};

export default StackedAreaChart;
