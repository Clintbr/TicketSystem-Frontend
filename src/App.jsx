import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/AppRouter';
import AxiosInterceptor from "./api/AxiosInterceptor.jsx";
import {BrowserRouter} from "react-router-dom";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter> {/* Der Router muss den Interceptor umschließen */}
                <AxiosInterceptor>
                    <AppRouter />
                </AxiosInterceptor>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;