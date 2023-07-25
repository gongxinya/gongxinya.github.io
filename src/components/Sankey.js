import React, { useState, useEffect, useRef, useContext } from 'react';
import { RangeContext } from '../GlobalContext';
import * as d3 from 'd3';
import { sankey, sankeyDiagram } from '../bundle/d3-sankey-diagram.min.js';
import tickData from '../data/task_transfer_counts.json';

const SankeyDiagram = () => {
  const diagramRef = useRef(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const range = useContext(RangeContext);
  const [linkData, setLinkData] = useState({}); // State variable for linkData


  useEffect(() => {
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

    const newLinkData = countTicksInRange(range[0], range[1], tickData);
    console.log(newLinkData);
    setLinkData(newLinkData);
  }, [range]);

  useEffect(() => {
    d3.select(diagramRef.current).select('svg').remove();
    const renderSankeyDiagram = () => {
      // Set up SVG
      const svg = d3.select(diagramRef.current);

      const layout = sankey()
        .linkValue((d) => d.value || 1)
        .nodeWidth(30)
        .extent([[100, 80], [1200, 480]]);

      // // Render
      // const color = d3.scaleOrdinal(d3.schemeCategory10);
      // Render
      const color = d3.scaleOrdinal()
        .domain(['forward', 'backward'])
        .range(['#007bff', '#ff7f00']);

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
      legendRects.exit().remove();
      legendRects
        .data(legendItems)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * 25)
        .attr('width', 20)
        .attr('height', 20)
        .style('fill', (d) => color(d));

      const legendLabels = legend.selectAll('text')
        .data(legendItems)
        .enter()
        .append('text')
        .attr('x', 80)
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
      return d.value + ' patients';
    }

    renderSankeyDiagram();
  }, [linkData]);



  return <svg width="1300" height="500" ref={diagramRef}></svg>;
};




export default SankeyDiagram;
