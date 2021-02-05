import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel, ButtonToolbar, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import './style.css';

class Filters extends Component {
  state = {
    name: '',
    exactMatch: false,
  };

  constructor(props) {
    super(props); 
  } 


  changeFilterByName = (event) => {
   
    if(event.target.value===''){
      this.state.name = '';
      this.props.onReset();
      window.location.reload(false);
    }
    else{
      this.state.name=event.target.value;
    }
    this.setState({
      name: event.target.value,
    });
    
   
    
    event.preventDefault();
   if (this.state.name.trim()) {
      this.props.onApply();
    }
    
  }

  reset = () => {

      this.setState({ name: '' });
      this.props.onReset();
      window.location.reload(false);

  }

  submit = (event) => {
    event.preventDefault();
    if (this.state.name.trim()) {
      this.props.onApply();
    }
  }

  changeExactMatchFlag = (event) => {
    this.setState({ exactMatch: event.target.checked })
  }

  render() {
    return (
      <Panel className="Filters" bsStyle="primary">
        <form onSubmit={this.submit}>
          <div className="row">
            <div className="col-md-4">
              <FormGroup controlId="filterByName">
                <ControlLabel>Search Character</ControlLabel>
                <FormControl type="text"
                            value={this.state.name}
                            onChange={this.changeFilterByName}
                            />
                </FormGroup>
            </div>
          </div>
          <ButtonToolbar>
            <Button onClick={this.reset}>View All Bookmarked</Button>
          </ButtonToolbar>
        </form>
      </Panel>
    );
  }
}

Filters.propTypes = {
  onApply: PropTypes.func,
  onReset: PropTypes.func,
};

Filters.defaultProps = {
  onApply: () => { },
  onReset: () => { },
};


export default Filters;
