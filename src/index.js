import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Progress, Segment, Dropdown, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

function App() {
  const [progressType, setProgressType] = useState(0);
  const [data, setData] = useState({});
  const [options, setOptions] = useState([]);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    fetch("https://pb-api.herokuapp.com/bars")
      .then(res => res.json())
      .then(res => {
        setData(res);
        console.log(res);
      })
      .catch(() => console.log("error"));
  }, []);

  useEffect(() => {
    if (data.bars) {
      let x = data.bars.map((i, index) => {
        return { key: index, text: `#Progress${index + 1}`, value: index };
      });

      setOptions(x);
    }
  }, [data]);

  return (
    <div className="App" style={{ padding: 20 }}>
      <Segment inverted style={{ padding: 20 }}>
        <label>Progress Bars</label>

        {data.bars &&
          data.bars.map((i, index) => {
            let color = "green";
            let percent = (i / data.limit) * 100;
            if (percent >= 25 && percent < 50) {
              color = "yellow";
            } else if (percent >= 50 && percent < 90) {
              color = "orange";
            } else if (percent >= 90) {
              color = "red";
            }
            return (
              <Progress
                color={color}
                key={index}
                percent={Math.round((i / data.limit) * 100)}
                inverted
                progress
              />
            );
          })}

        <Dropdown
          style={{ paddingRight: 20 }}
          value={progressType}
          onChange={(evt, data) => {
            setProgressType(data.value);
          }}
          options={options}
        />

        {data.buttons &&
          data.buttons.map((i, index) => {
            return (
              <Button
                key={index}
                onClick={() => {
                  let tempBars = data.bars.slice();
                  tempBars[progressType] = tempBars[progressType] + i;
                  setData({
                    ...data,
                    bars: tempBars
                  });
                }}
              >
                {i}
              </Button>
            );
          })}
      </Segment>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
