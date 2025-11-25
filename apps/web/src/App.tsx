import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import './styles/theme.css'
import './styles/global.css'
import "./api/interceptor.ts";
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.ts';
import { Toaster } from "@/components/ui/sonner"

function App() {
    const router = createRouter({ routeTree })
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster position='top-center'/>
            <RouterProvider router={router} />
        </QueryClientProvider>
    )
}

export default App;