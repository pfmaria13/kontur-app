import {useState} from 'react'

import Login from "./pages/Login.tsx";
import "./style/style.css"
import "./style/reset.css"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Form from "./components/form/Form.tsx";
import MainPage from "./pages/MainPage.tsx";
import Competition from "./pages/Competition.tsx";

function App() {


    return (
        <>
            <Router>
                {/*<Login/>*/}
                <MainPage/>
                <Routes>
                    <Route path="/form" element=<Form/> />
                    <Route path="/competition" element=<Competition/> />
                </Routes>
            </Router>
        </>
    )
}

export default App
