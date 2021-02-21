import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Drizzle } from "@drizzle/store";
import PortfolioToken from "./contracts/PortfolioToken.json";

const options = {
    contracts: [PortfolioToken],
    web3: {
          fallback: {
                  type: "ws",
                  url: "ws://0.0.0.0:8545",
                },
        },
};

const drizzle = new Drizzle(options);

ReactDOM.render(<App drizzle={drizzle} />, document.getElementById('root'));