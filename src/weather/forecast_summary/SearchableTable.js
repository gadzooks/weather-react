import SummaryTable from './SummaryTable';
import { TextField } from '@mui/material';
import React from 'react';

class SearchableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchText: "", inputs: props.inputs };
    //TODO why do we do this
    this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
  }

  _handleTextFieldChange(event) {
    this.setState({ searchText: event.target.value });
  }

  render() {
    return (
      <>
        <TextField
          id="outlined-basic"
          label="Search Locations"
          variant="outlined"
          padding="5px"
          onChange={this._handleTextFieldChange}
        />
        <SummaryTable
          name="SummaryTable"
          inputs={this.state.inputs}
          searchText={this.state.searchText}
        />
      </>
    );
  }
}

export default SearchableTable;