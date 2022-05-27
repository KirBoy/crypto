import {Routes, Route, Link} from "react-router-dom";
import Converter from "./conponents/Converter/Convertor";
import CriptoPack from "./conponents/CriptoPack/CriptoPack";
import Navigation from "./conponents/Navigation";
import PageNotFound from "./conponents/PageNotFound/PageNotFound";


function App() {

    return (
        <Routes>
            <Route path="/" element={<Navigation/>}>
                <Route path="converter"  element={<Converter/>}/>
                <Route path="criptopack" element={<CriptoPack/>}/>
            </Route>
            <Route path="*" element={<PageNotFound/>}  />
        </Routes>
    );
}

export default App;
