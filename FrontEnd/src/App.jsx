import AppRoutes from './routes/AppRoutes'
import store from './App/Store'
import {Provider} from 'react-redux'
import { LanguageProvider } from './context/language'
import "./config/i18n"
import { useContext } from 'react'
import { LanguageContext } from './context/language'
import useFacebookPixel from "./Hooks/useFacebookPixel"

function AppContent() {
  const { language } = useContext(LanguageContext)
  
  return (
    <div id='root' dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {useFacebookPixel()}
      {/* The useFacebookPixel hook initializes the Facebook Pixel */}
      {/* It should be called at the top level of your component tree */}
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App