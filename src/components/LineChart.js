import React, { useEffect, useRef, useState, useContext } from 'react';
import { RangeContext, TaskNameContext } from '../GlobalContext';
import { Button, Dropdown, Space, Tooltip, Checkbox } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import * as d3 from 'd3';
import toData from '../data/ToTask.json';
import fromData from '../data/FromTask.json'
import currentData from '../data/CurrentTask.json'

const SVG_WIDTH = 1500;
const SVG_HEIGHT = 280;
const margin = { top: 10, right: 160, bottom: 30, left: 100 };
const width = SVG_WIDTH - margin.left - margin.right;
const height = SVG_HEIGHT - margin.top - margin.bottom;



const plainOptions = ['Inflow', 'Outflow', 'Current'];


const LineChart = () => {
    const svgRef = useRef(null);
    const tooltipRef = useRef(null); // Reference to the tooltip element
    const verticalLineRef = useRef(null);
    const bubbleRef = useRef(null);
    const range = useContext(RangeContext);
    const selectedTask = useContext(TaskNameContext);

    // State variables to track the visibility of each line
    const [showInflow, setShowInflow] = useState(true);
    const [showOutflow, setShowOutflow] = useState(true);
    const [showCurrent, setShowCurrent] = useState(true);

    const onChange = (checkedValues) => {
        if (checkedValues.includes("Inflow")) {
            setShowInflow(true);
        } else {
            setShowInflow(false);
        }

        if (checkedValues.includes("Outflow")) {
            setShowOutflow(true);
        } else {
            setShowOutflow(false);
        }

        if (checkedValues.includes("Current")) {
            setShowCurrent(true);
        } else {
            setShowCurrent(false);
        }
    };

    useEffect(() => {
        document.documentElement.scrollTop = document.documentElement.clientHeight;
        document.documentElement.scrollLeft = document.documentElement.clientWidth;
    }, []);

    useEffect(() => {
        const formattedTreatmentToData = processData(toData, selectedTask, range);
        const formattedTreatmentFromData = processData(fromData, selectedTask, range);
        const formattedTreatmentCurrentData = processData(currentData, selectedTask, range);

        // Remove the existing SVG element
        d3.select(svgRef.current).select('svg').remove();

        // Append the SVG object to the container
        const svg = d3
            .select(svgRef.current)
            .append('svg')
            .attr('width', SVG_WIDTH)
            .attr('height', SVG_HEIGHT)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);


        // Add X axis
        const x = d3
            .scaleLinear()
            .domain(d3.extent(formattedTreatmentCurrentData, (d) => d.time))
            .range([0, width]);
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        // Add the x-axis label "Time (tick)"
        svg.append('text')
            .attr('x', width) // Center the label
            .attr('y', height + 20) // Position below the x-axis
            .text('Time (tick)')
            .style('font-size', '14px')
            .style('font-family', 'Arial, sans-serif')
            .style('fill', '#333')
            .attr('text-anchor', 'middle'); // Set text-anchor to 'middle' for centering


        // Add Y axis
        const y = d3
            .scaleLinear()
            .domain([0, d3.max(formattedTreatmentCurrentData, (d) => d.count)])
            .range([height, 0]);
        svg.append('g').call(d3.axisLeft(y));


        // Add the Y-axis label "Time (tick)"
        svg.append('text')
            .attr('x', 60) // Center the label
            .attr('y', 0) // Position below the x-axis
            .text('Number of patients')
            .style('font-size', '14px')
            .style('font-family', 'Arial, sans-serif')
            .style('fill', '#333')
            .attr('text-anchor', 'middle'); // Set text-anchor to 'middle' for centering

        // Add the Flow in line (conditionally)
        if (showInflow) {
            svg.append('path')
                .datum(formattedTreatmentToData)
                .attr('fill', 'none')
                .attr('stroke', '#6495ED')//blue
                .attr('stroke-width', 2)
                .attr('d', d3.line()
                    .x((d) => x(d.time))
                    .y((d) => y(d.count)));
        }

        // Add the Flow out line (conditionally)
        if (showOutflow) {
            svg.append('path')
                .datum(formattedTreatmentFromData)
                .attr('fill', 'none')
                .attr('stroke', '#FF6347')//red
                .attr('stroke-width', 2)
                .attr('d', d3.line()
                    .x((d) => x(d.time))
                    .y((d) => y(d.count)));
        }

        // Add the task current line (conditionally)
        if (showCurrent) {
            svg.append('path')
                .datum(formattedTreatmentCurrentData)
                .attr('fill', 'none')
                .attr('stroke', '#00b359')//green
                .attr('stroke-width', 2)
                .attr('d', d3.line()
                    .x((d) => x(d.time))
                    .y((d) => y(d.count)));
        }



        // Add the title
        svg.append('text')
            .attr('x', width / 2 - 50)
            .attr('y', 0)
            .text("Task: " + selectedTask)
            .style('font-size', '16px')
            .style('font-family', 'Arial, sans-serif') // Set the font family
            .style('font-weight', 'bold')
            .style('fill', '#333') // Set the font color
            .attr('alignment-baseline', 'middle');



        // Add the legend line for inflow 
        svg.append('line')
            .attr('x1', width + 10)
            .attr('y1', 10)
            .attr('x2', width + 40)
            .attr('y2', 10)
            .style('stroke', 'blue')
            .style('stroke-width', 2);

        svg.append('text')
            .attr('x', width + 50)
            .attr('y', 10)
            .text('Inflow')
            .style('font-size', '16px')
            .attr('alignment-baseline', 'middle');



        // Add the legend line for outflow 
        svg.append('line')
            .attr('x1', width + 10)
            .attr('y1', 30)
            .attr('x2', width + 40)
            .attr('y2', 30)
            .style('stroke', 'red')
            .style('stroke-width', 2);

        svg.append('text')
            .attr('x', width + 50)
            .attr('y', 30)
            .text('Outflow')
            .style('font-size', '16px')
            .attr('alignment-baseline', 'middle');


        // Add the legend line for current 
        svg.append('line')
            .attr('x1', width + 10)
            .attr('y1', 50)
            .attr('x2', width + 40)
            .attr('y2', 50)
            .style('stroke', 'green')
            .style('stroke-width', 2);

        svg.append('text')
            .attr('x', width + 50)
            .attr('y', 50)
            .text('Current')
            .style('font-size', '16px')
            .attr('alignment-baseline', 'middle');


        // Get or create the vertical line using the useRef
        let verticalLine = verticalLineRef.current;
        let bubble = bubbleRef.current;

        // Create a vertical dotted line using the <line> element
        if (!verticalLine) {
            console.log("it's verticalLine");
            verticalLine = svg
                .append('line') // Append the line to the main SVG container
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
            const mouseXPosition = d3.mouse(this)[0]; // Get the x-coordinate of the mouse pointer within the SVG

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



            // Show the tooltip with the x-axis value
            tooltip
                .style('left', `${d3.event.pageX - 440}px `)
                .style('top', -250)
                .style('visibility', 'visible')
                .html(`Time: ${~~xValue} tick`);


        });

        svg.on('mouseout', function () {
            // Hide the vertical line and tooltip when the mouse leaves the SVG area
            verticalLine.style('opacity', 0);
            tooltip.style('visibility', 'hidden');
        });


    }, [range, selectedTask, showInflow, showOutflow, showCurrent]);

    return (
        <div>
            <div>
                <Checkbox.Group options={plainOptions} defaultValue={['Inflow', 'Outflow', 'Current']} onChange={onChange} style={{ marginLeft: '100px' }} />
                <Tooltip title="Select the lines you want to display" trigger="click" defaultOpen>
                    <QuestionCircleTwoTone />
                </Tooltip>
            </div>
            <br />
            <br />

            <svg width={SVG_WIDTH} height={SVG_HEIGHT} ref={svgRef} />
            <div
                ref={tooltipRef}
                id="tooltip"
                style={{ position: 'relative', visibility: 'hidden' }}
            ></div>
        </div>
    );
};

function processData(rawData, TASK_NAME, range) {
    const data = rawData[TASK_NAME]
    // Filter the data for ticks between 3000 and 4000
    const filteredData = data.filter((d) => d > range[0] && d < range[1]);
    // Create a set of all time points
    const allTimePoints = new Set(filteredData);

    // Determine the minimum and maximum time points
    const MinTime = d3.min(filteredData);
    const MaxTime = d3.max(filteredData);

    // Generate an array of objects with time and count properties
    const formattedData = [];
    for (let i = ~~range[0]; i <= ~~range[1]; i++) {
        formattedData.push({
            time: i,
            count: allTimePoints.has(i) ? filteredData.filter((d) => d === i).length : 0,
        });
    }
    return formattedData;
}

export default LineChart;
