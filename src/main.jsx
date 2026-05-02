import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {ChakraProvider, ColorModeScript} from "@chakra-ui/react";
import theme from "./theme.js";

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
            <App/>
        </ChakraProvider>
    </>
)
