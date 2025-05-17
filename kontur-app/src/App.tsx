import {useState} from 'react'

import Login from "./pages/Login.tsx";
import "./style/style.css"
import "./style/reset.css"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Form from "./components/form/Form.tsx";
import MainPage from "./pages/MainPage.tsx";
import Line from "./components/line/Line.tsx";
import Competition from "./pages/Competition.tsx";
import Plot from "./pages/Plot.tsx";
import Rules from "./pages/Rules.tsx";

function App() {


    return (
        <>
            <Router>
                {/*<Login/>*/}
                <Competition/>
                <Routes>
                    <Route path="/form" element=<Form/> />
                    <Route path="/mainPage" element=<MainPage/>/>
                    <Route path="/rules" element=<Rules/>/>
                </Routes>
            </Router>
        </>
    )
}

export default App
