import React, {Suspense} from "react";
import ReactDOM from "react-dom";
import App from "./App";
const Header = React.lazy(() => import('./Header'));

var mountNode = document.getElementById("app");
ReactDOM.render(<>
    <App name="worldddd !" />
    <Suspense fallback={<div>Loading...</div>}>
        <Header name="headddddsdfasfdssdfr !" />
    </Suspense>
</>, mountNode);