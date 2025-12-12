import VendingMachine from "./components/VendingMachine/VendingMachine";
import { VendingMachineProvider } from "./context/VendingMachineProvider";
import "./styles/index.scss";

function App() {
  return (
    <VendingMachineProvider>
      <VendingMachine />
    </VendingMachineProvider>
  );
}

export default App;
