import SummaryTable from './SummaryTable';
import { TextField } from '@mui/material';
import React from 'react';

class SearchableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchText: "", inputs: props.inputs };
  }

  render() {
    return (
      <>
        <TextField
          id="outlined-basic"
          label="Search Locations"
          variant="outlined"
          padding="5px"
          //   onChange={this._handleTextFieldChange}
        />
        <SummaryTable name="SummaryTable" inputs={this.state.inputs} />
      </>
    );
  }
}

export default SearchableTable;