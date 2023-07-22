import React, {Component} from 'react';

import PlanetsSelectionPanel from "./PSP";
import VehicleSelectionPanel from "./VSP";
import {withAppContext} from '../AppContextProvider';
import Utils from '../utils';

function detail(props) {
    const {label, value, classNames} = props;
    
    return (
        <div ><span>{label} : </span>{value}</div>
    );
}

function planetd(props) {
    const { distance } = props;
    return distance ? <detail label={'Distance'} value={distance} />
        : null;
}

function vehicleD(props) {
    const { vehicle } = props;
    if(!vehicle)
        return null;

    const {name, max_distance, speed} = vehicle;
    return (<div >
        <detail label={'Name'} value={name} />
        <detail label={'Maximum Distance'} value={max_distance}/>
        <detail label={'Speed'} value={speed}/>
    </div>);
}

class EntitySelectionPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.selectPlanet = this.selectPlanet.bind(this);
        this.selectVehicle = this.selectVehicle.bind(this);
    }
    selectPlanet(selectedOption, prevOption) {
        const { selectedDatas, planets, contextActions, vehicles } = this.props;
        const selectedPlanet = selectedOption.value;
        const distance = Utils.getPlanetDistance(planets, selectedPlanet);
        selectedDatas[selectedPlanet] = undefined;
        if(prevOption) {
            delete selectedDatas[prevOption.value];
        }
        this.recalculateVehicleAvailability(selectedDatas, vehicles);
        contextActions.updateAppState({selectedDatas, vehicles});
        this.setState({selectedPlanet, distance, selectedVehicle:undefined});
    }
    selectVehicle(selectedVehicle) {
        const { contextActions, selectedDatas, vehicles } = this.props;
        const { selectedPlanet } = this.state;
        selectedDatas[selectedPlanet] = selectedVehicle;
        this.recalculateVehicleAvailability(selectedDatas, vehicles);
        this.setState({selectedVehicle: Utils.findByName(vehicles, selectedVehicle)});
        contextActions.updateAppState({selectedDatas, vehicles});
    }

    recalculateVehicleAvailability(selectedDatas, vehicles) {
        const vehiclesSelected = Object.values(selectedDatas);
        //Available number calculation
        return vehicles.map(v => {
            const totalSelected = Utils.size(Utils.filterByValue(vehiclesSelected, v.name));
            v.availble_no = v.total_no - (totalSelected ? totalSelected : 0);
            return v;
        });
    }

    render () {
        const {selectedPlanet, distance, selectedVehicle} = this.state;
        return (
            <div className={'entitySelectionPanel'}>
                <PlanetsSelectionPanel {...this.props} planetChangeHandler={this.selectPlanet}/>
                <planetd distance={distance}/>
                <VehicleSelectionPanel {...this.props}
                    distance={distance}
                    planet={selectedPlanet}
                    key={selectedPlanet}
                    vehicleChangeHandler={this.selectVehicle}/>
                <vehicleD vehicle={selectedVehicle} />
            </div>
        );
    }

}

export default withAppContext(EntitySelectionPanel);