import React, { useEffect, useRef, useContext } from 'react';
import { RangeContext, TaskNameContext, StateContext } from '../GlobalContext';
import * as d3 from 'd3';
// import rawData from '../data/taskState_spent.csv';
import rawData from '../data/BedOccupantionRate.csv';

const SVG_WIDTH = 500;
const SVG_HEIGHT = 200;
const margin = { top: 20, right: 40, bottom: 30, left: 30 };
const width = 500 - margin.left - margin.right;
const height = 200 - margin.top - margin.bottom;

const MyGraph = ({ time }) => {
    const graphRef = useRef(null);
    const range = useContext(RangeContext);
    const selectedTask = useContext(TaskNameContext);
    const selectedSate = useContext(StateContext);
    const xValue = time; // Change this value to your desired x-coordinate value


    useEffect(() => {
        // Remove the existing SVG element
        d3.select(graphRef.current).select('svg').remove();

        // Create the tooltip element
        const tooltip = d3
            .select(graphRef.current)
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        // Append the svg object to the div
        const svg = d3
            .select(graphRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Read the data
        d3.csv(rawData, (d) => {
            return { date: +d.current_tick, value: +d.occupation_rate };
        }).then((data) => {
            const yValue = (data.find((d) => d.date === xValue)?.value || 0);


            // Filter the data by 'current_tick' values
            const filteredData = data.filter((d) => +d.date >= range[0] && +d.date <= range[1]);

            // Add X axis
            const x = d3.scaleLinear().domain(d3.extent(filteredData, (d) => d.date)).range([0, width]);
            svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x).tickSize(-5));

            // Add Y axis
            const y = d3
                .scaleLinear()
                // .domain([0, d3.max(filteredData, (d) => d.value)])
                .domain([0, 100])
                .nice()
                .range([height, 0]);
            svg.append('g').call(d3.axisLeft(y));

            // Add the x-axis label "Time (tick)"
            svg.append('text')
                .attr('x', width) // Center the label
                .attr('y', height + 20) // Position below the x-axis
                .text('Time (tick)')
                .style('font-size', '14px')
                .style('font-family', 'Arial, sans-serif')
                .style('fill', '#333')
                .attr('text-anchor', 'middle'); // Set text-anchor to 'middle' for centering


            // Add the Y-axis label "
            svg.append('text')
                .attr('x', 60) // Center the label
                .attr('y', -10) // Position below the x-axis
                .text(`Bed occupation ratio(%)`)
                .style('font-size', '14px')
                .style('font-family', 'Arial, sans-serif')
                .style('fill', '#333')
                .attr('text-anchor', 'middle'); // Set text-anchor to 'middle' for centering

            // Set the gradient
            svg
                .append('linearGradient')
                .attr('id', 'line-gradient')
                .attr('gradientUnits', 'userSpaceOnUse')
                .attr('x1', 0)
                .attr('y1', y(0))
                .attr('x2', 0)
                .attr('y2', y(d3.max(filteredData, (d) => d.value)))
                .selectAll('stop')
                .data([{ offset: '0%', color: 'blue' }, { offset: '100%', color: 'red' }])
                .enter()
                .append('stop')
                .attr('offset', (d) => d.offset)
                .attr('stop-color', (d) => d.color);

            // Add the line
            svg
                .append('path')
                .datum(filteredData)
                .attr('fill', 'none')
                .attr('stroke', 'url(#line-gradient)')
                .attr('stroke-width', 2)
                .attr('d', d3.line().x((d) => x(d.date)).y((d) => y(d.value)));

            // Add dashed auxiliary line at x-coordinate value "xValue"
            svg
                .append('line')
                .attr('x1', x(xValue))
                .attr('y1', 0)
                .attr('x2', x(xValue))
                .attr('y2', height)
                .attr('stroke', 'red')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5, 5'); // Set the dash pattern, in this case, 5px solid and 5px space

                svg
                .append('text')
                .attr('x', x(xValue)) // Center the label
                .attr('y', 0) // Position below the x-axis
                .text(`Ratio: ${yValue.toFixed(2)}%`)
                .style('font-size', '13px')
                .style('font-family', 'serif')
                .style('fill', 'red')
                .attr('text-anchor', 'middle'); // Set text-anchor to 'middle' for centering

        });
    }, [range, selectedTask, selectedSate, time]);

    return <svg width={SVG_WIDTH} height={SVG_HEIGHT} ref={graphRef}></svg>;
};

export default MyGraph;
