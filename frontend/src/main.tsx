import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


//Import Global CSS: Any global styles that apply to the entire app can be imported here.
//Finds root element: This is where your React app will be mounted in the HTML document.
// Renders the App component: This is the main component that contains your entire application.