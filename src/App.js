import React from 'react';

import './App.css';
import AppContextProvider from "./AppContextProvider";
import Components from './components/Comp';
const {  ContentsPanel, Footer } = Components;

function App() {
  return (
      <AppContextProvider>
          <div>
              
              <ContentsPanel />
              <Footer/>
          </div>
      </AppContextProvider>
  );
}

export default App;
