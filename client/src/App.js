import './App.css';
import DisplayPortfolio from "./DisplayPortfolio";
import ManagePortfolio from "./ManagePortfolio";

import React, { Component } from 'react';

class App extends Component {
    state = { loading: true, drizzleState: null };

    componentDidMount() {
      const { drizzle } = this.props;
      this.unsubscribe = drizzle.store.subscribe(() => {
        const drizzleState = drizzle.store.getState();
        if (drizzleState.drizzleStatus.initialized) {
          this.setState({ ...this.state, loading: false, drizzleState });
        }
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      if (this.state.loading) return "Loading Drizzle...";
      return (
        <div className="App">
          <DisplayPortfolio
            drizzle={this.props.drizzle}
            drizzleState={this.state.drizzleState}
          />
          <ManagePortfolio
            drizzle={this.props.drizzle}
            drizzleState={this.state.drizzleState}
          />
        </div>
      );
    }
}

export default App;
