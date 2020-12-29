import React from 'react';
import Autosuggest from 'react-autosuggest';
import debounce from 'lodash.debounce';
import { withRouter } from 'next/router';


async function getMatchingWords(inputValue) {
  if (!inputValue.length) {
    return [];
  }
  let data = [];
  const result = await fetch(encodeURI(`/api/suggest?query=${inputValue}`))
  const json = await result.json();
  return json.data;
}


function getSuggestionValue(suggestion) {
  return suggestion.id;
}

function renderSuggestion(suggestion) {
  return (
    <div>{suggestion.id}</div>
  );
}

function randomDelay() {
  return 300 + Math.random() * 1000;
}

class Search extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
      isLoading: false
    };

    this.debouncedLoadSuggestions = debounce(this.loadSuggestions, 250);
  }
  
  async loadSuggestions(value) {
    this.setState({
      isLoading: true
    });
    
    const suggestions = await getMatchingWords(value);

    if (value === this.state.value) {
      this.setState({
        isLoading: false,
        suggestions
      });
    } else { // Ignore suggestions if input value changed
      this.setState({
        isLoading: false
      });
    }
  }
  
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionSelected = (e, {suggestionValue}) => {
    const { router } = this.props;
    const { value } = this.state;
    router.push(`/salita/${suggestionValue}`);
  }
  
  onSuggestionsFetchRequested = ({ value }) => {
    this.debouncedLoadSuggestions(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSubmit = (e) => {
    const { router } = this.props;
    const { value } = this.state;
    e.preventDefault();
    router.push(`/hanapin/${value}`);
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Maghanap…",
      value,
      onChange: this.onChange
    };

    return (
      <form className="search-form" onSubmit={this.onSubmit} >
        <Autosuggest 
          suggestions={suggestions}
          onSuggestionSelected={this.onSuggestionSelected}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps} />
      </form>
    );
  }
}

export default withRouter(Search);
