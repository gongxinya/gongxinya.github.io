import React, { useState, useEffect, useRef, useContext } from 'react';
import { Select, Tooltip, Button } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { RangeContext } from '../GlobalContext';
import * as d3 from 'd3';
import { sankey, sankeyDiagram } from '../bundle/d3-sankey-diagram.min.js';
import tickData from '../data/task_transfer_counts.json';

import PlayButton from './PlayButton';

const SankeyDiagram = () => {
  const diagramRef = useRef(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const range = useContext(RangeContext);
  const [linkData, setLinkData] = useState({}); // State variable for linkData

  // Add state variables for the play button and tick index
  const [isPlaying, setIsPlaying] = useState(false);
  const [tickIndex, setTickIndex] = useState(~~range[0]);
  const [startTick, setStartTick] = useState(range[0]);
  const [endTick, setEndTick] = useState(range[1]);

  useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);

  // Function to start or pause the animation
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Function to update the tick index and startTick/endTick
  const updateTick = () => {
    if (!isPlaying) {
      setEndTick(range[1])
      return;
    }
    if (tickIndex >= range[1]) {
      // Stop the animation when reaching the end of the data
      setIsPlaying(false);
    } else if (tickIndex <= range[0]) {
      setTickIndex(range[0]);
      setEndTick(tickIndex);
      setTickIndex((prevIndex) => prevIndex + 50);
    } else {
      setEndTick(tickIndex);
      setTickIndex((prevIndex) => prevIndex + 50);
    }
  };



  // Add a new useEffect to handle the animation
  useEffect(() => {
    console.log("tickIndex: " + tickIndex)
    const interval = setInterval(updateTick, 1000); // Adjust the interval as needed
    return () => clearInterval(interval);
  }, [isPlaying, tickIndex]);

  // Update linkData based on the startTick and endTick
  useEffect(() => {
    console.log("startTick: " + startTick + "endTick: " + endTick)
    const newLinkData = countTicksInRange(startTick, endTick, tickData);
    setLinkData(newLinkData);
  }, [endTick]);


  // Update linkData based on the startTick and endTick
  useEffect(() => {
    setStartTick(range[0]);
    if(!isPlaying) {
      setEndTick(range[1]);
    }
    if (!isPlaying || tickIndex > range[1]) {
      setTickIndex(range[0])
    } else if (tickIndex < range[0]) {
      setTickIndex(range[0])
    }
    console.log("startTick: " + startTick + "endTick: " + endTick)
    const newLinkData = countTicksInRange(startTick, endTick, tickData);
    setLinkData(newLinkData);
  }, [range]);

  useEffect(() => {
    d3.select(diagramRef.current).select('svg').remove();
    // Remove the old legend before rendering the new one
    d3.select(diagramRef.current).select('.legend').remove();
    const renderSankeyDiagram = () => {
      // Set up SVG
      const svg = d3.select(diagramRef.current);

      const layout = sankey()
        .linkValue((d) => Math.round(d.value) || 1)
        .nodeWidth(30)
        .extent([[100, 80], [1200, 480]]);

      // // Render
      // const color = d3.scaleOrdinal(d3.schemeCategory10);
      // Render
      const color = d3.scaleOrdinal()
        .domain(['forward', 'backward'])
        .range(['#5d9dd5', '#E58E00']);

      const diagram = sankeyDiagram()
        .linkMinWidth(function (d) { return 0.1; })
        .nodeValue(nodeValue)
        .linkColor((d) => color(d.type))

      // const linkTitle = d3.sankeyLinkTitle((d) => d.source.title, (d) => d.type, d3.format(",.0f")); // Generate link title function based on node title, link type, and number format
      // Add legend
      const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(950, 50)');

      const legendItems = ['Forward Flow', 'Reverse Flow'];


      const legendRects = legend.selectAll('rect')
      legendRects
        .data(legendItems)
        .enter()
        .append('rect')
        .attr('x', 60)
        .attr('y', (d, i) => i * 25)
        .attr('width', 20)
        .attr('height', 20)
        .style('fill', (d) => color(d));

      const legendLabels = legend.selectAll('text')
        .data(legendItems)
        .enter()
        .append('text')
        .attr('x', 100)
        .attr('y', (d, i) => i * 25 + 15)
        .text((d) => d);

      var graph = layout({
        nodes: [
          { id: 'entry', title: 'Entry' },
          { id: 'assign', title: 'Assign' },
          { id: 'admission', title: 'Admission' },
          { id: 'diagnose', title: 'Diagnose' },
          { id: 'treatment', title: 'Treatment' },
          { id: 'recovery', title: 'Recovery' },
          { id: 'discharge', title: 'Discharge' },
          { id: 'transfer', title: 'Transfer' },
          { id: 'out', title: 'Out' },
        ],
        links: [
          { source: 'entry', target: 'assign', type: 'forward', value: linkData['Entry_Assign'] },
          { source: 'assign', target: 'admission', type: 'forward', value: linkData['Assign_Admission'] },
          { source: 'assign', target: 'transfer', type: 'forward', value: linkData['Assign_Transfer'] },
          { source: 'transfer', target: 'diagnose', type: 'forward', value: linkData['Transfer_Diagnose'] },
          { source: 'admission', target: 'diagnose', type: 'forward', value: linkData['Admission_Diagnose'] },
          { source: 'diagnose', target: 'treatment', type: 'forward', value: linkData['Diagnose_Treatment'] },
          { source: 'treatment', target: 'recovery', type: 'forward', value: linkData['Treatment_Recovery'] },
          { source: 'treatment', target: 'discharge', type: 'forward', value: linkData['Treatment_Discharge'] },
          { source: 'recovery', target: 'treatment', type: 'backward', value: linkData['Recovery_Treatment'] },
          { source: 'recovery', target: 'assign', type: 'backward', value: linkData['Recovery_Assign'] },
          { source: 'recovery', target: 'discharge', type: 'forward', value: linkData['Recovery_Discharge'] },
          { source: 'discharge', target: 'out', type: 'forward', value: linkData['Recovery_Discharge'] },
        ],
      })
        ;

      try {
        layout(graph);
        svg.datum(graph).call(diagram);

      } catch (error) {
        // Handle the error gracefully
        console.error('Error occurred during chart rendering:', error);
      }
    };



    function nodeValue(d) {
      return d.value + "P";
    }

    renderSankeyDiagram();
  }, [linkData]);



  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="The Sankey Graph below only shows patient flow for the selected time frame. Click the play button to see the dynamic flow of the patient." trigger="click" placement="bottom">
          <QuestionCircleTwoTone />
        </Tooltip>
        <h3 style={{ marginRight: '20px', marginLeft: '10px', fontSize: '20px', color: '#333333', fontWeight: 'bold' }}>
        Time range: From <span style={{ backgroundColor: '#3a86ca', padding: '5px', borderRadius: '5px', color: 'white' }}>{~~startTick}</span> tick to <span style={{ backgroundColor: '#3a86ca', padding: '5px', borderRadius: '5px', color: 'white' }}>{~~endTick}</span> tick
      </h3>
        <PlayButton isPlaying={isPlaying} onClick={handlePlayPause} />
      </div>
      <svg width="1300" height="500" ref={diagramRef}></svg>
    </div>
  );

};

// Update linkData whenever the range changes
const countTicksInRange = (startTick, endTick, tickData) => {
  const categoryCounts = {};

  for (const category in tickData) {
    let count = 0;
    const categoryData = tickData[category];

    for (const tick in categoryData) {
      if (tick >= startTick && tick <= endTick) {
        count += categoryData[tick];
      }
    }
    categoryCounts[category] = count;
  }

  return categoryCounts;
};


export default SankeyDiagram;
