import { connect } from "react-redux";
import React from 'react';
import App from "./App.tsx";
import {LoadThunk} from "./reducers/gamePage-reducer";
class MiddleToDoListComponent extends React.Component {
    componentDidMount() {
        this.props.LoadThunk();
    }
    render(){
        return(<App {...this.props}/>)
    }
}

function mapStateToProps(state){
    return {gamePage : state.gamePage}
}

const AppContainer = connect(mapStateToProps, {LoadThunk}) (MiddleToDoListComponent)
export default AppContainer;