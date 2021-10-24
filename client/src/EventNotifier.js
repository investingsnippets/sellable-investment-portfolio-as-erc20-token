import {EventActions} from "@drizzle/store";
import { toast } from 'react-toastify'

// Due to an issue with metamask we get several fires for teh same event:
// https://github.com/MetaMask/metamask-extension/issues/6668
// To avoid that we just make sure that we do not retrigger
let processed_events = new Set();

const EventNotifier = store => next => action => {

    if (action.type === EventActions.EVENT_FIRED && !processed_events.has(action.event.transactionHash)) {
        console.log(action);
        const contract = action.name
        const contractEvent = action.event.event
        const message = action.event.returnValues._message
        const display = `${contract}(${contractEvent}): ${message}`
        console.log(display);
        toast.success(display, { position: toast.POSITION.TOP_RIGHT })
        processed_events.add(action.event.transactionHash);
    }
    return next(action);
}

export default EventNotifier;