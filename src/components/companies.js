import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import Select from 'react-select';
const collumns = ['Name', 'Symbol', 'Last Price', 'Score'];
const baseURL = 'http://localhost:8080';

// Simulates the call to the server to get the data
// const fakeDataFetcher = {
//   fetch(page, size) {
//     return new Promise((resolve, reject) => {
//       resolve({ items: _.slice(dataTable, (page - 1) * size, ((page - 1) * size) + size), total: dataTable.length });
//     });
//   }
// };

class BootstrapTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      sort: null,
      filter: null,
      // totalSize: 0,
      // page: 1,
      // sizePerPage: 10,
    };
    this.fetchData = this.fetchData.bind(this);
    this.sortData = this.sortData.bind(this);
    this.filterData = this.filterData.bind(this);
    this.handleSizePerPageChange = this.handleSizePerPageChange.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData(params) {
    // const { symbol, score, sort_score, sort_fluct, page } = params;
    axios.get(`${baseURL}/companies`, { params }).then(resp => {
      this.setState({ items: resp.data });
    }).catch((err) => {
      alert('Error fetchinng data');
      this.setState({ items: [] });
    });
  }

  sortData(selectedOption) {
    const options = {};
    options[selectedOption.value] = (this.state.sort && this.state.sort.value) === selectedOption.value ? 'desc' : 'asc';
    this.setState({ sort: selectedOption });
    this.fetchData(options);
  }

  filterData(e) {
    const options = {};
    if (e.target.value && e.target.value.trim()) {
      options[e.target.name] = e.target.value;
    }
    this.setState({ filter: options });
    this.fetchData(options);
  }


  handleSizePerPageChange(sizePerPage) {
    // When changing the size per page always navigating to the first page
    this.fetchData(1, sizePerPage);
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <br /><br />
            <h3>Companies</h3><br />

            <Table borderless responsive="md">
              <tbody>
                <tr>
                  <td colSpan="4">Sort:
                    <div><Select
                      name="select-sort"
                      value={this.state.sort}
                      onChange={this.sortData}
                      options={[
                        { value: null, label: 'Default' },
                        { value: 'sort_score', label: 'Score' },
                        { value: 'sort_fluct', label: 'Fluctuation' },
                      ]}
                    /></div>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">Score:&nbsp;
                    <input type="text" name="score" onChange={this.filterData} />
                  </td>

                  <td colSpan="2">Symbol:&nbsp;
                    <input type="text" name="symbol" onChange={this.filterData} />
                  </td>
                </tr>
              </tbody>
            </Table>

            <Table name="companies" striped bordered hover responsive="md">
              <thead>
                <tr>
                  {
                    collumns.map((c, index) => {
                      return (<th key={`col${index}`}>{c}</th>);
                    })
                  }
                </tr>
              </thead>
              <tbody>
                {
                  this.state.items.map((i) => {
                    return (
                      <tr>
                        <td>{i.name}</td>
                        <td>{i.unique_symbol}</td>
                        <td>${i.recentPrice}</td>
                        <td>{i.total}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    )

  }
}

export default BootstrapTable;