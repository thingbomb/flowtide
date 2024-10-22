import { useState, useEffect } from "react";
import { CommandPalette } from "./components/ui/cmd";
import CharacterCounter from "./CharacterCounter";
import WordCounter from "./WordCounter";

const images = [
  { url: "assets/photos/1.jpg", color: "#FFFFFF" },
  { url: "assets/photos/2.jpg", color: "#FFFFFF" },
  { url: "assets/photos/3.jpg", color: "#FFFFFF" },
  { url: "assets/photos/4.jpg", color: "#FFFFFF" },
  { url: "assets/photos/5.jpg", color: "#FFFFFF" },
  { url: "assets/photos/6.jpg", color: "#FFFFFF" },
  { url: "assets/photos/7.jpg", color: "#FFFFFF" },
  { url: "assets/photos/8.jpg", color: "#FFFFFF" },
  { url: "assets/photos/9.jpg", color: "#FFFFFF" },
  { url: "assets/photos/10.jpg", color: "#FFFFFF" },
  { url: "assets/photos/11.jpg", color: "#FFFFFF" },
  { url: "assets/photos/12.jpg", color: "#FFFFFF" },
  { url: "assets/photos/13.jpg", color: "#FFFFFF" },
  { url: "assets/photos/14.jpg", color: "#FFFFFF" },
  { url: "assets/photos/15.jpg", color: "#FFFFFF" },
  { url: "assets/photos/16.jpg", color: "#FFFFFF" },
  { url: "assets/photos/17.jpg", color: "#FFFFFF" },
  { url: "assets/photos/18.jpg", color: "#FFFFFF" },
  { url: "assets/photos/19.jpg", color: "#FFFFFF" },
  { url: "assets/photos/20.jpg", color: "#FFFFFF" },
  { url: "assets/photos/21.jpg", color: "#000000" },
  { url: "assets/photos/22.jpg", color: "#FFFFFF" },
  { url: "assets/photos/23.jpg", color: "#FFFFFF" },
  { url: "assets/photos/24.jpg", color: "#FFFFFF" },
  { url: "assets/photos/25.jpg", color: "#FFFFFF" },
  { url: "assets/photos/26.jpg", color: "#FFFFFF" },
];

function App() {
  const [time, setTime] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState({});
  const [selectedPage, setSelectedPage] = useState("none");

  useEffect(() => {
    const intervalId = setInterval(() => setTime(new Date()), 1000);
    setSelectedImage(images[Math.floor(Math.random() * images.length)]);
    return () => {
      clearInterval(intervalId);
      setSelectedImage({});
    };
  }, []);

  const options = { hour: "2-digit", minute: "2-digit", hour12: true };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-black text-white bg-cover"
      style={{ backgroundImage: `url(${selectedImage.url})` }}
      id="app"
    >
      <CommandPalette setSelectedPage={setSelectedPage} />
      <h1
        className="text-7xl font-bold clock"
        style={{ color: selectedImage.color }}
      >
        {time.toLocaleTimeString(undefined, options)}
      </h1>
      {selectedPage === "character-counter" && (
        <CharacterCounter setSelectedPage={setSelectedPage} />
      )}
      {selectedPage === "word-counter" && (
        <WordCounter setSelectedPage={setSelectedPage} />
      )}
    </div>
  );
}

export default App;
