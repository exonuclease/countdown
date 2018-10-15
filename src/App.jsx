import React, { Component } from 'react';
import { Progress, Button, Input, List, Checkbox } from 'antd';
import './App.css';

const { TextArea } = Input;
const { Item } = List;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], text: '', sortByTime: false };
    this.flag = null;
  }

  onSave = () => {
    if (this.flag) clearInterval(this.flag);
    this.flag = null;
    this.setState({
      data: JSON.parse(this.state.text).map(item => ({ ...item, current: 0 }))
    });
  };

  onChange = e => {
    this.setState({ text: e.target.value });
  };

  onCheckChange = e => {
    this.setState({ sortByTime: e.target.checked });
  };

  updateTime = () => {
    let newData = this.state.data.map(item => {
      let nextSec;
      if (item.current < item.interval) {
        nextSec = item.current + 1;
      } else if (item.current) {
        nextSec = 1;
      }
      return { ...item, current: nextSec };
    });
    if (this.state.sortByTime) {
      newData = newData.sort(
        (a, b) => a.interval - a.current - (b.interval - b.current)
      );
    }
    this.setState({
      data: newData
    });
  };

  onStart = () => {
    if (this.flag) clearInterval(this.flag);
    this.flag = setInterval(this.updateTime, 1000);
  };

  render() {
    return (
      <div className="App">
        <div className="content">
          <List
            className="list"
            bordered
            dataSource={this.state.data}
            renderItem={item => (
              <Item>
                {
                  <div className="list-item">
                    <p style={{ marginRight: '10px' }}>{item.name}</p>
                    <Progress
                      percent={(item.current / item.interval) * 100}
                      format={() => `${item.current}/${item.interval}`}
                    />
                  </div>
                }
              </Item>
            )}
          />
          <Button onClick={this.onStart}>开始</Button>
          <TextArea value={this.state.text} onChange={this.onChange} />
          <Button onClick={this.onSave}>保存/清零</Button>
          <Checkbox onChange={this.onCheckChange}>根据剩余时间排序</Checkbox>
        </div>
      </div>
    );
  }
}

export default App;
