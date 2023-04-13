import { Landing, Register, Error, ProtectedRoute, SkipSetup } from "./pages"
import { Profile, Stats, AddBet, AllBets, SharedLayout } from "./pages/dashboard"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path='/' 
          element={
            <ProtectedRoute>
              <SharedLayout/>
            </ProtectedRoute>
          } 
        >
          <Route index element={<Stats/>} />
          <Route path="add-bet" element={<AddBet/>} />
          <Route path="all-bets" element={<AllBets/>} />
          <Route path="profile" element={<Profile/>} />
        </Route>
        <Route 
          path='/register' 
          element={
            <SkipSetup>
            <Register/>
            </SkipSetup>
          } 
        />
        <Route path='/landing' element={<Landing />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
