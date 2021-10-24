import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import EventNotifier from "./EventNotifier";

import { Drizzle, generateStore  } from "@drizzle/store";
import PortfolioToken from "./contracts/PortfolioToken.json";

const options = {
    contracts: [PortfolioToken],
    web3: {
        fallback: {
            type: "ws",
            url: "ws://0.0.0.0:8545",
        },
    },
    events: {
        PortfolioToken: ["AssetAdded", "AssetChanged", "AssetDeleted"],
    },
    polls: {
        accounts: 3000,
    },
};

const drizzleStore = generateStore({drizzleOptions: options, appMiddlewares: [EventNotifier]});
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render(<App drizzle={drizzle} />, document.getElementById('root'));