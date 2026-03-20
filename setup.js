const fs = require('fs');
const path = require('path');

const dirs = [
  'public/images',
  'src/components/layout',
  'src/components/circuit',
  'src/components/packet',
  'src/components/shared',
  'src/styles'
];

const files = {
  'src/components/layout/Header.jsx': 'export default function Header() { return <header>Header</header>; }',
  'src/components/layout/StatusBar.jsx': 'export default function StatusBar() { return <footer>Status</footer>; }',
  'src/components/circuit/CircuitMatrix.jsx': 'export default function CircuitMatrix() { return <div>Circuit Matrix</div>; }',
  'src/components/circuit/SwitchNode.jsx': 'export default function SwitchNode() { return <div>Switch Node</div>; }',
  'src/components/circuit/ConnectionLine.jsx': 'export default function ConnectionLine() { return <div>Connection Line</div>; }',
  'src/components/packet/RouterWeb.jsx': 'export default function RouterWeb() { return <div>Router Web</div>; }',
  'src/components/packet/RouterNode.jsx': 'export default function RouterNode() { return <div>Router Node</div>; }',
  'src/components/packet/Datagram.jsx': 'export default function Datagram() { return <div>Datagram</div>; }',
  'src/components/shared/EndPoint.jsx': 'export default function EndPoint() { return <div>End Point</div>; }',
  'src/styles/index.css': '/* Global styles */',
  'src/styles/theme.css': '/* Theme variables */',
  'src/styles/typography.css': '/* Typography */',
  'src/App.jsx': 'import React from "react";\nexport default function App() { return <div>App</div>; }',
  'src/main.jsx': 'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App.jsx";\nimport "./styles/index.css";\nimport "./styles/theme.css";\nimport "./styles/typography.css";\n\nReactDOM.createRoot(document.getElementById("root")).render(\n  <React.StrictMode><App /></React.StrictMode>\n);',
  'public/images/.keep': ''
};

dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

Object.entries(files).forEach(([f, content]) => {
  fs.writeFileSync(path.join(__dirname, f), content);
});

// Clean up old vite files
try { fs.unlinkSync(path.join(__dirname, 'src/App.css')); } catch (e) {}
try { fs.unlinkSync(path.join(__dirname, 'src/index.css')); } catch (e) {}
try { fs.rmSync(path.join(__dirname, 'src/assets'), { recursive: true, force: true }); } catch (e) {}
