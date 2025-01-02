import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/AuthProvider";
// import { ReactQueryDevtools } from "react-query/devtools";

ReactDOM.render(
	<BrowserRouter>
		<ToastContainer />
		<QueryClientProvider client={new QueryClient()}>
			<AuthProvider>
				<App />
			</AuthProvider>
			{/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />  // This is only needed for deveolopment*/} 
		</QueryClientProvider>
	</BrowserRouter>,
	document.getElementById("root")
);
serviceWorkerRegistration.register();

reportWebVitals();
