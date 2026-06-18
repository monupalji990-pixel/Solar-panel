import React, { useState } from 'react';

export default class DefaultCheckboxEditor extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        selectOptions: props.options.map(e => ({
          value: e,
          isChecked: props.value.includes(e)
        }))
      }
    }
  
    state: {
      selectOptions: any
    }
    props: any;

    handleCheckChieldElement(event) {
      let temp = this.state.selectOptions
      temp.forEach(e => {
        if (e.value === event.target.value)
          e.isChecked = event.target.checked
      })
      this.setState({ selectOptions: temp })
      let valueArray:any = [];
      console.log(this.state.selectOptions);
  
      this.state.selectOptions.map(e => {
        if (e.isChecked) {
          valueArray.push(e.value);
        }
      }
      )
  
      this.props.fProps.values[this.props.id] = valueArray;
    }
    render() {
      return <ul>
        {
          this.state.selectOptions.map(e => {
            return <li>
              <input
                key={e.value}
                onClick={this.handleCheckChieldElement.bind(this)}
                type="checkbox"
                checked={e.isChecked}
                value={e.value} />
              {e.value}
            </li>
          })
        }
      </ul>
    }
  }