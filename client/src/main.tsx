import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("Aplikasyon ap demarè...");

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Eleman root pa jwenn nan HTML la!");
  } else {
    console.log("Eleman root jwenn, ap anrejistre aplikasyon React...");
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("Aplikasyon rann avèk siksè!");
  }
} catch (error) {
  console.error("Erè pandan enstalasyon aplikasyon an:", error);
}
