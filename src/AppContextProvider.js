import React, { Component } from 'react';
import Utils from "./utils";

export const AppContext = React.createContext();
const { BASE_ENDPOINT_URL } = Utils;

export const withAppContext = (Component) =>
   (props) => (
       <AppContext.Consumer>
         {(contextProps) => <Component {...contextProps} {...props}/>}
       </AppContext.Consumer>
   );

export const destinationCount = 4;

class AppContextProvider extends Component {
    constructor() {
        super();
        this.state = {
            planets: [],
            vehicles: [],
            selectedDatas: {},
            contextActions: {
                updateAppState: this.updateAppState.bind(this),
                updateSelectedData: this.updateSelectedData.bind(this)
            }
        }
        console.log(this);

        this.fetchUrl = this.fetchUrl.bind(this);
    }
    async fetchUrl(type, options) {
        
        if(type==='planets'){
            const response = await fetch('https://findfalcone.geektrust.com/planets');
      const data = await response.json();
      console.log(data);
      this.setState({[type]: data});
      return;
        }
        else if(type==='vehicles'){
            const response = await fetch('https://findfalcone.geektrust.com/vehicles');
            const data = await response.json();
            this.setState({[type]: data});
            return ;
        }
        else if(type==='token'){
            const tokenResponse = await fetch('https://findfalcone.geektrust.com/token', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              });
              const { token } = await tokenResponse.json();
              console.log(token);
              this.setState({[type]: token});
              return ;
        }
        console.log(type);
        console.log(options);
        try {
            const url = BASE_ENDPOINT_URL + type;
            const response = await fetch(url, options);
            const jsonResponse = await response.json();
            const data = jsonResponse[type] ? jsonResponse[type] : jsonResponse;
            this.setState({[type]: data});
            console.log(data);
        } catch {
            this.setState({error: 'Error while fetching data for ' + type  + '!!'})
        }
    }

    updateAppState(newState) {
        this.setState(newState);
    }

    updateSelectedData(planet, vehicle) {
        const { selectedDatas } = this.state;
        selectedDatas[planet] = vehicle;
        this.setState({selectedDatas});
    }

    async componentDidMount() {
        console.log("find falconapi")
        const { fetchUrl } = this;
        ['planets', 'vehicles'].forEach(type => fetchUrl(type));
        fetchUrl('token', {
                method: 'post',
                headers: Utils.requestHeadersForJsonContent()
            });
    }

    render() {
        return <AppContext.Provider value={this.state}>{this.props.children}</AppContext.Provider>;
    }
}
export default AppContextProvider;