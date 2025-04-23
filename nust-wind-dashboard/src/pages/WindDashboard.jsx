
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const directionOptions = {
  "East (+x)": "x",
  "West (-x)": "-x",
  "North (+y)": "y",
  "South (-y)": "-y",
  "NE (+x+y)": "+x+y",
  "SW (-x-y)": "-x-y",
  "SE (+x-y)": "+x-y",
  "NW (-x+y)": "-x+y",
};

const speeds = ["1ms", "5ms"];

const WindDashboard = () => {
  const [data, setData] = useState({ points: [] });
  const [speed, setSpeed] = useState("1ms");
  const [direction, setDirection] = useState("East (+x)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/data/${speed}_${directionOptions[direction]}.json`);
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Failed to load data:", error);
        setData({ points: [] });
      }
    };
    fetchData();
  }, [speed, direction]);

  const bounds = [[0, 0], [452, 100]];
  const imageUrl = "/assets/nust_img.jpg";

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">🌍 NUST Campus Wind Visualization Dashboard</h2>

      <div className="flex flex-wrap gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Speed: {speed}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {speeds.map((sp) => (
              <DropdownMenuItem key={sp} onClick={() => setSpeed(sp)}>{sp}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Direction: {direction}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.keys(directionOptions).map((dir) => (
              <DropdownMenuItem key={dir} onClick={() => setDirection(dir)}>{dir}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardContent className="relative p-0">
          <MapContainer
            center={[226, 50]}
            zoom={1}
            scrollWheelZoom={false}
            style={{ height: "500px", width: "100%" }}
            crs={L.CRS.Simple}
          >
            <ImageOverlay url={imageUrl} bounds={bounds} />
            {data.points.map((pt, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  top: `${452 - pt.y}px`,
                  left: `${pt.x}px`,
                  color: "#007BFF",
                  fontSize: "12px",
                  fontWeight: "bold",
                  pointerEvents: "none",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {pt.v.toFixed(1)} m/s
              </div>
            ))}
          </MapContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default WindDashboard;
