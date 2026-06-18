import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { MainPage } from './pages/main';
import './form.css';
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import { consumerReducer, consumerSaga, sliceKeyConsumer } from "../consumer/redux/consumer";

declare const google

export default function SurveyIndex(props) {

    useInjectReducer({ key: sliceKeyConsumer, reducer: consumerReducer });
    useInjectSaga({ key: sliceKeyConsumer, saga: consumerSaga })

    const [mapLoaded, setMapLoaded] = React.useState(false);

    useEffect(() => {
        // Check if the 'google' object is available
        if (google && google.maps) {
            setMapLoaded(true);
        } else {
            // Listen for the script's 'load' event
            const script = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
            script.addEventListener('load', () => {
                setMapLoaded(true);
            });
        }
    }, []);

    return (
        <Switch>
            {mapLoaded ?
                <Route path="/lead-data/form" component={MainPage} />
                : 'Loading...'}
        </Switch>
    );
}
