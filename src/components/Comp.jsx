import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import {withAppContext} from "../AppContextProvider";
import Result from "../pages/Results";
import Home from "../pages/Home";

function Header() {
    const logo = "/logo.png"
    return (
        <div className={'headerBar'}>
            <div><img src={logo} alt={'Logo'}/></div>
        </div>
    );
}

function ErrorPage(props) {
    return <div className={'errorMessage'}>{props.error}</div>
}

function RouterConfig() {
    return (
        <Router>
            <Switch>
                <Route path="/search">
                    <Home />
                </Route>
                <Route path="/results">
                    <Result />
                </Route>
                <Route exact path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    );
}

function ContentsPanel(props) {
    return (
        <div className={'contentsPanel'}>
            <SectionHeader/>
            <div className={'dataContainer'}>
                {props.error ? <ErrorPage {...props}/> : <RouterConfig/> }
            </div>
        </div>
    );
}

function Footer() {

    return (
        <div className={'footerBar'}>
            <a > Finding Falcone App made by laxmi</a>
        </div>
    );
}

function SectionHeader() {
    return <div className={'sectionHeader'}>Finding The Falcone! App made my laxmi for</div>
}

function detail(props) {
    const {label, value} = props;
    return <div>{label} : {value}</div>
}

export default {
    Header,
    ContentsPanel: withAppContext(ContentsPanel),
    SectionHeader,
    Footer,
    detail
};