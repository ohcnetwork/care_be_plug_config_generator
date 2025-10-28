import { Toaster } from "sonner";
import PluginSelector from "./PluginSelector";

function App() {
  return (
    <div>
      <Toaster
        position="top-center"
        theme="light"
        richColors
        expand
        toastOptions={{}}
      />
      <PluginSelector />
    </div>
  );
}

export default App;
