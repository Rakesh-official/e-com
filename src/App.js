import React, { Component, useState } from "react";

import "./App.css";

const formatNumber = (number) => new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);
class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      branch1 : "",
      branch2 : "",
      branch3 : "",
      merged: [],
      filtered: [],
      searches: [],
      sum: 0
    }

    Promise.all([
      fetch("api/branch1.json").then(resp => resp.json()),
      fetch("api/branch2.json").then(resp => resp.json()),
      fetch("api/branch3.json").then(resp => resp.json())
    ]).then((data)=>{
      this.setState({branch1: data[0]})
      this.setState({branch2: data[1]})
      this.setState({branch3: data[2]})

      this.setState({ merged: [...this.state.branch1.products, ...this.state.branch2.products, ...this.state.branch3.products]})

      var clean = this.state.merged.filter((arr, index, self) =>
      index === self.findIndex((t) => (t.id === arr.id && t.name === arr.name)))
      this.setState({ filtered: clean})
      this.setState({ searches: clean})

    })

  }

  onpress = (ev)=> {
    this.state.sum = 1
    if(ev.target.value. length > 0){

      this.setState({searches: this.state.filtered.filter((item)=>{

        if( item.name.toLowerCase().includes( ev.target.value.toLowerCase())){

          return item;

        }

    })}) 
    }else{

      this.setState({searches: this.state.merged})

    }

  }

  allSum(){
      let total = 0;
      this.state.merged.forEach((element) => {
        total = total+element.unitPrice
        
      });
      return total
  }
  filterSum(){
      let total = 0;
      this.state.searches.forEach((element) => {
        total = total+element.unitPrice
        
      });
      return total
  }

 

  render() {
    return (
      <div className="product-list">
        <label>Search Products</label>
        <input type="text" onKeyUp={ (ev)=>{ this.onpress(ev)}}/>
        
        <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.searches.map((item, i)=>{

                return <tr key={i}><td>{ item.name }</td><td>{ item.unitPrice }</td></tr>
            })
          }
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>
            {
              (this.state.sum === 0) ? this.allSum() : this.filterSum()
            }
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
  }
}

export default App;
