import React, { useEffect, useRef, useContext } from 'react';
import { RangeContext, TaskNameContext, StateContext, PatientIdContext } from '../GlobalContext';
import * as d3 from 'd3';
import rawData from '../data/taskState_spent.csv';

const SVG_WIDTH = 1500;
const SVG_HEIGHT = 200;
const margin = { top: 40, right: 40, bottom: 30, left: 30 };
const width = 1500 - margin.left - margin.right;
const height = 200 - margin.top - margin.bottom;
const pointRadius = 5;

const MyGraph = ({ onPatientChange }) => {
  const graphRef = useRef(null);
  const range = useContext(RangeContext);
  const selectedTask = useContext(TaskNameContext);
  const selectedState = useContext(StateContext);
  const selectedPatientId = useContext(PatientIdContext);

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
      if (d.task === selectedTask && d.state === selectedState) {
        return { date: +d.start_tick, value: +d.ticks_spent, id: d.id, location: d.location, task: d.task };
      }
    }).then((data) => {
      data.sort((a, b) => a.date - b.date);

      // Filter the data by 'current_tick' values
      const filteredData = data.filter((d) => +d.date >= range[0] && +d.date <= range[1]);

      const filteredValue = filteredData.filter((d) => +d.value > 1);
      const values = filteredValue.map((d) => d.value);
      const sortedData = values.sort((a, b) => a - b);
      const firstQuartile = d3.quantile(sortedData, 0.25);
      const thirdQuartile = d3.quantile(sortedData, 0.75);
      const interQuartileRange = thirdQuartile - firstQuartile;
      const maxIQR = thirdQuartile + interQuartileRange * 1.5;


      // Add X axis
      const x = d3.scaleLinear().domain(d3.extent(filteredData, (d) => d.date)).range([0, width]);
      svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x).tickSize(-5));

      // Add Y axis
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, (d) => d.value) + 1])
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


      // Add the Y-axis label "Time (tick)"
      svg.append('text')
        .attr('x', 60) // Center the label
        .attr('y', -10) // Position below the x-axis
        .text(`${selectedState} time spent(tick)`)
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



      // Add the points
      svg
        .selectAll('circle')
        .data(filteredData)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.date))
        .attr('cy', (d) => y(d.value))
        .attr('r', pointRadius)
        .attr("fill", (d) => {
          if (d.value > maxIQR) {
            return "red"; // Dot is red if greater than maxIQR
          } else if (d.value > thirdQuartile) {
            return "orange"; // Dot is orange if greater than thirdQuartile but less than maxIQR
          } else {
            return "#44378588"; // Default color for the dots
          }
        })
        .on('mouseover', (event, d) => {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip
            .html(d.value)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 20}px`);
        })
        .on('mouseout', () => {
          tooltip.transition().duration(200).style('opacity', 0);
        });

      // Add a highlighted circle around the selectedPatientId
      svg.selectAll(".highlight-circle")
        .data(filteredData.filter(d => d.id === selectedPatientId))
        .enter()
        .append("circle")
        .attr("class", "highlight-circle")
        .attr("cx", (d) => x(d.date))
        .attr("cy", (d) => y(d.value))
        .attr("r", pointRadius + 2) // Adjust the radius for the highlight circle
        .attr("fill", "none")
        .attr("stroke", "#4169E1") // Color of the stroke
        .attr("stroke-width", 4); // Width of the stroke


      // Add the title
      svg
        .append('text')
        .attr('x', -10)
        .attr('y', -30)
        .text("Selected task: " + selectedTask + " (" + selectedState + ")")
        .style('font-size', '16px')
        .style('font-family', 'Arial, sans-serif')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .attr('alignment-baseline', 'middle');



      // Create the brush
      const brush = d3.brush()
        .extent([[0, 0], [width, height]])
        .on('end', brushed);

      // Append the brush to the svgContainer
      const brushGroup = svg.append('g')
        .attr('class', 'brush')
        .call(brush);

      function brushed() {
        // Get the selection extent
        const selection = d3.event.selection;

        // If there is a selection, find the data points within the selection
        if (selection) {
          // console.log(selection);
          const selectedPatientData = filteredData.filter(
            (d) => x(d.date) >= selection[0][0] && x(d.date) <= selection[1][0] && y(d.value) >= selection[0][1] && y(d.value) <= selection[1][1]
          );

          // Log the selected data points to the console
          // console.log(selectedData);
          onPatientChange(selectedPatientData);

          // You can do further processing with the selectedData if needed
        }
      }
    });
  }, [range, selectedTask, selectedState, selectedPatientId ]);

  return <svg width={SVG_WIDTH} height={SVG_HEIGHT} ref={graphRef}></svg>;
};

export default MyGraph;
