import React, { Component, useState, useEffect } from 'react';

import { withAppContext } from "../AppContextProvider";
import TimeTakenPanel from "../components/TimeTakenPanel";
import {Redirect, withRouter} from "react-router-dom";
import Utils from "../utils";

function LoadingText() {
    const loadingString = 'Loading';
    const [text, setText] = useState(loadingString);
    useEffect(() => {
        const interval = setInterval(() => {
            setText(t=> t.length < 11 ? t+'.' : loadingString);
        }, 200);
        return () => clearInterval(interval);
    }, []);
    return <div><span className={'loadingText'}>{text}</span></div>;
}

function ErrorMessage(props) {
    return props.error ? <div className={'failureMessage'}>{props.error}</div> : null;
}

function SuccessMessage(props) {
    return (
        <div className={'successMessage'}>
            <div>
                Found Falcone in {props.planet}
                <div><TimeTakenPanel /></div>
            </div>
        </div>
    );
}

class ResultsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            error: '',
            isRedirected: false
        };

        this.startAgainHandler = this.startAgainHandler.bind(this);
    }
    startAgainHandler() {
        const { vehicles, contextActions } = this.props;
        vehicles.forEach(v=>{delete v.availble_no});
        contextActions.updateAppState({selectedDatas: {}, vehicles});
        this.setState({isRedirected: true});
    }
    async componentDidMount() {
        console.log(this.props);
        
      
        


        const { selectedDatas, token } = this.props;
       
        let selectedplanet=Object.keys(selectedDatas);
        let selectedvehicles=Object.values(selectedDatas);
        const requestBody = {
            token: token,
            planet_names: selectedplanet,
            vehicle_names: selectedvehicles,
          };
            // Send request to find Falcone
          const findFalconeResponse = await fetch('https://findfalcone.geektrust.com/find', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
      
          const findFalconeData = await findFalconeResponse.json();

          this.setState({isLoading: false, ...findFalconeData});
return ;

        const body = JSON.stringify({
            token,
            planet_names: Object.keys(selectedDatas),
            vehicle_names: Object.values(selectedDatas)
        });
        const options = { method: 'post', headers: Utils.requestHeadersForJsonContent(), body };
        const searchResultsResponse = await fetch(Utils.BASE_ENDPOINT_URL + 'find', options);
        const searchResults = await searchResultsResponse.json();
        
    }

    render() {
        const {planet_name, status, error, isLoading, isRedirected} = this.state;
        if(isRedirected) {
            return <Redirect to={'/'} key={'home'}/>;
        }
        const result = isLoading ? <LoadingText /> : (status === 'success' ?
                <SuccessMessage planet={planet_name}/> : <ErrorMessage error={
                    status === 'false' ? 'Unable to find Falcone. Sorry!!' : error}/>);
        return (
            <div className={'resultsContainer'}>
                {result}
                <div className={'startAgain'} >
                    <button onClick={this.startAgainHandler} disabled={isLoading}> Start Again </button>
                </div>
            </div>
        );
    }

}

export default withAppContext(withRouter(ResultsPage));