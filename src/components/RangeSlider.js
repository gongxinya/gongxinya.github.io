import React, { useEffect, useContext, useRef, useState } from "react";
import { RangeContext } from '../GlobalContext';
import RangeSlider from "data-driven-range-slider";
import tickData from "../data/tick_data.json";
import taskTransferCountsData from "../data/task_transfer_counts.json";
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { Row, Col, Tooltip } from 'antd';
import { debounce } from 'lodash';

const RangeSliderComponent = ({ onRangeChange }) => {
  const [selectedRange, setSelectedRange] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const range = useContext(RangeContext);
  const nodeRef = useRef(null);

  // Use the debounce function to create a debounced version of onRangeChange
  const debouncedOnRangeChange = useRef(debounce(onRangeChange, 500)).current;


  useEffect(() => {
    createDiagram();
  }, []);

  const createDiagram = () => {
    const node = nodeRef.current;
    const countsData = taskTransferCountsData;
    const newData = tickData;

    if (!newData) {
      return;
    }

    let chart = null;

    if (!chart) {
      chart = new RangeSlider();
    }

    chart
      .container(node)
      .svgWidth(window.innerWidth - 150)
      .svgHeight(80)
      .data(newData)

      .onBrush((d) => {
        localStorage.setItem("selectedRange", JSON.stringify(d.range));
        setSelectedRange(d.range);
        setSelectedData(d.data);
        // Instead of directly calling onRangeChange, use the debounced version
        debouncedOnRangeChange(d.range);
      })
      .render();

    return () => {
      // Clean up chart instance if needed
      if (chart) {
        chart.destroy();
      }
    };
  };

  useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);

  return (
    <div>
      <Row
        style={{
          color: '#333333',
          borderRadius: '10px',
          backgroundColor: '#b8e0bc',
          alignItems: 'center',
        }}
      >
        <Col style={{ color: '#333333', fontSize: '16px', margin: '10px' }}>
          Selected tick range: {range.length && ~~range[0].toString()} to {range.length && ~~range[1].toString()}
        </Col>
        <Col>
          <Tooltip title="Choose a time range to display specific data on the chart. Click the icon in the lower-left corner to toggle the time range selector." trigger="click" defaultOpen>
            <QuestionCircleTwoTone />
          </Tooltip>
        </Col>
      </Row>

      {/* <div>Selected data length: {selectedData.length} </div> */}
      <div
        style={{
          marginTop: '10px',
          borderRadius: '5px',
          paddingTop: '20px',
          paddingLeft: '20px',
          backgroundColor: '#ffffff00', // Update the background color here
        }}
        ref={nodeRef}
      />
    </div>
  );



};

export default RangeSliderComponent;
