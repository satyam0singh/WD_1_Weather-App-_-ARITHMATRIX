
# 🌦️ ArithMatrix Weather App — Current Conditions

A **responsive weather web app** powered by the **OpenWeather API**, built with **HTML, CSS, and JavaScript**.  
Users can enter a **city name** or **latitude/longitude coordinates** to fetch **real-time weather conditions** including temperature, humidity, wind speed, visibility, and weather description.  

🔗 **Live Demo:** [ArithMatrix Weather App](https://weather-app-arithmatrix.netlify.app)  

---

## 📡 API
The app uses the **OpenWeather Current Weather API**:  
👉 [OpenWeather Docs](https://openweathermap.org/current)  

---

## 📁 Repository Structure
repo/<br>
├── index.html # Main HTML structure <br>
├── style.css # Styling (responsive, accessible)<br>
├── script.js # JavaScript (API fetch, DOM updates)<br>
├── screenshots/ # App demo screenshots<br>
│ ├── search.png<br>
│ └── error.png<br>
├── README.md # Documentation<br>

---

## 🚀 Features
- 🌍 **Search by city name or coordinates (lat,lon)**  
- 🌡️ Displays **temperature, humidity, wind speed, visibility, and conditions**  
- ⚡ **Real-time API calls** with OpenWeather  
- 🛑 **Error handling** for invalid inputs or unknown cities  
- 📱 Fully **responsive UI** (desktop, tablet, mobile)  
- ♿ **Accessible HTML** with ARIA roles  

---

## ⚙️ Setup & Usage
Clone the repo:
```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app

bash
index.html
🔑 API Key Setup
Get your free API key from OpenWeather.
Open script.js and update:
const API_KEY = "your_api_key_here";


# 📸 Demo
* ✅ Successful Search <img width="1114" height="910" alt="Image" src="https://github.com/user-attachments/assets/a3c56e2e-c2b9-4719-95e8-11b644a2d4e5" />
* ❌ Invalid Input <img width="1134" height="901" alt="Image" src="https://github.com/user-attachments/assets/4361ded0-9cfe-4947-ae0f-3b4d2c4d8ae2" />

# 🛠️ Tech Stack
* Frontend: HTML, CSS, JavaScript
* API: OpenWeather (Current Weather)
* Hosting: Netlify

📜 License
MIT License © 2025 Satyam Singh

🙌 Acknowledgements
* OpenWeather for the free weather API
* Netlify for seamless deployment
