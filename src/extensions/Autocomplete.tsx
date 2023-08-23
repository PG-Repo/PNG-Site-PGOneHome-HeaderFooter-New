import * as React from "react";

export interface IAutocompleteProps {  
    suggestions:any;
  }
interface IAutocompleteState {
    activeSuggestion:number;
    filteredSuggestions: any[];
    showSuggestions:boolean;
    userInput:string;
    SPbindSearchSuggestion:any[];
  }
export default class Autocomplete extends React.Component<IAutocompleteProps, IAutocompleteState> {
    constructor(props) {
      super(props);
      this.state = {
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: "",
        SPbindSearchSuggestion:[]
      };
    }

  

    private onChange = e => {
      const { suggestions } = this.props;
      const userInput = e.currentTarget.value;
  
      const filteredSuggestions = suggestions.filter(
        suggestion =>
          suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
      );
  
      this.setState({
        activeSuggestion: 0,
        filteredSuggestions,
        showSuggestions: true,
        userInput: e.currentTarget.value
      });
    }

     

     private onClick = e => {
        this.setState({
          activeSuggestion: 0,
          filteredSuggestions: [],
          showSuggestions: false,
          userInput: e.currentTarget.innerText
        });
      }

    private  onKeyDown = e => {

        const { activeSuggestion, filteredSuggestions } = this.state;
    
        if (e.keyCode === 13) {
          this.setState({
            activeSuggestion: 0,
            showSuggestions: false,
            userInput: filteredSuggestions[activeSuggestion]
          });
        } else if (e.keyCode === 38) {
          if (activeSuggestion === 0) {
            return;
          }
          this.setState({ activeSuggestion: activeSuggestion - 1 });
        }
        // User pressed the down arrow, increment the index
        else if (e.keyCode === 40) {
          if (activeSuggestion - 1 === filteredSuggestions.length) {
            return;
          }
          this.setState({ activeSuggestion: activeSuggestion + 1 });
        }
      }

     public render() {
        const {
          onChange,
          onClick,
          onKeyDown,
          state: {
            activeSuggestion,
            filteredSuggestions,
            showSuggestions,
            userInput
          }
        } = this;
    
        let suggestionsListComponent;
    
        if (showSuggestions && userInput) {
          if (filteredSuggestions.length) {
            suggestionsListComponent = (
              <ul className="suggestions">
                {filteredSuggestions.map((suggestion, index) => {
                  let className;
    
                  // Flag the active suggestion with a class
                  if (index === activeSuggestion) {
                    className = "suggestion-active";
                  }
    
                  return (
                    <li className={className} key={suggestion} onClick={onClick}>
                      {suggestion}
                    </li>
                  );
                })}
              </ul>
            );
          } else {
            suggestionsListComponent = (
              <div className="no-suggestions">
                <em>No suggestions, you're on your own!</em>
              </div>
            );
          }
        }
    
        return (
          <React.Fragment>
            <input
              type="text"
              onChange={onChange}
              onKeyDown={onKeyDown}
              value={userInput}
            />
            {suggestionsListComponent}
          </React.Fragment>
        );
      }




























    }