# Network Switching Architecture Simulator

An interactive, educational web application built with React that visualizes the fundamental differences between **Circuit Switching** and **Packet Switching** networks. 

This project is perfectly suited to serve as a standalone educational tool or as an interactive module (like Option 9) within a larger computer networking curriculum menu.

## 🌟 Key Features

### 1. Circuit Switching Simulation
Visualizes how early telephone networks and dedicated circuits operate by reserving a physical path before data can flow.
* **Dedicated Paths:** Click to connect a User (A, B, C, D) to a Server (1, 2, 3, 4). A green line physically draws across the screen to show the reserved wire.
* **Resource Exhaustion (Blockage):** The central trunk line only has 3 physical wires. 
  * *Example:* If you connect A to 1, B to 2, and C to 3, the network is full. If you try to connect D to 4, the hardware will flash red, buzz, and block the connection because there are no wires left!

### 2. Packet Switching Simulation
Visualizes how the modern internet works by breaking data into smaller pieces (datagrams) and sending them through router queues.
* **Datagram Routing:** Click "Send Data" to watch a file get broken into 4 separate packets that physically slide across the screen into the central router.
* **Network Congestion:** The central router (Core) has a limited memory queue of 5 slots. 
  * *Example:* If you spam the "Send Data" button, the router receives packets faster than it can process them. The queue fills up, the router flashes a red warning, and incoming packets are permanently dropped and tracked in the "Packets Lost" counter.

### 3. Polish & UI
* **Audio Feedback:** Satisfying clicks for successful actions and harsh buzzes for network errors.
* **Educational Tooltips:** Hover over any router or switch to see a pop-up explaining its current status (e.g., "WARNING: Buffer Queue is 100% full!").
* **Smooth Transitions:** A seamless fade-in toggle button lets users switch between the two network types instantly to compare them.

---

## 🛠️ Tech Stack
* **Framework:** React + Vite
* **Styling:** Pure CSS (No external libraries). Features custom keyframe animations, flexbox layouts, and dynamic styling based on React state.
* **Assets:** AI-generated realistic hardware representations.

---

## 🚀 Setup and Installation

Follow these simple steps to run the simulator on your local machine:

1. **Install Dependencies:**
   Open your terminal in the project folder and run:
   ```bash
   npm install