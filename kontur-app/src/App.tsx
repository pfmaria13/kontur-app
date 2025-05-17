import {useState} from 'react'

import MainPage from "./pages/MainPage.tsx";
import "./style/style.css"
import "./style/reset.css"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Form from "./components/form/Form.tsx";

function App() {


    return (
        <>
            <Router>
                <MainPage/>
                <Routes>
                    <Route path="/form" element=<Form/> />
                </Routes>
            </Router>
        </>
    )
}

export default App
