import './App.css';
import { BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import NavBar from './components/NavBar';
import TwoCam from './components/TwoCam';
import Stitched from './components/Stitched';
import OneCam from './components/OneCam';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<TwoCam />} />
        <Route path='/stitched' element={<Stitched />} />
        <Route path='/onecam' element={<OneCam />} />
      </Routes>
    </Router>
  );
}

export default App;
