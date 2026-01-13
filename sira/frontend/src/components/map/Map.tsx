import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/kartenlogo.png"

const StandortKarte: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const googleMapRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const loadGoogleMaps = () => {
      return new Promise<void>((resolve, reject) => {
        if ((window as any).google && (window as any).google.maps) {
          resolve();
          return;
        }

        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          const checkGoogle = setInterval(() => {
            if ((window as any).google && (window as any).google.maps) {
              clearInterval(checkGoogle);
              resolve();
            }
          }, 100);
          return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA3UQbDrxu8lNEZJq-rTXbpxdjUBYETlWI&libraries=maps,marker&v=beta&loading=async`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (err) => {
          console.error("Fehler beim Laden des Google Maps Scripts:", err);
          reject(err);
        };
        document.head.appendChild(script);
      });
    };

    loadGoogleMaps()
      .then(() => {
        if (!mountedRef.current || !containerRef.current) return;

        setTimeout(() => {
          if (!mountedRef.current || !containerRef.current) return;

          // NEU: Map-Container dynamisch erstellen und NICHT von React verwalten lassen
          const mapDiv = document.createElement('div');
          mapDiv.style.width = '100%';
          mapDiv.style.height = '100%';
          mapDiv.style.position = 'relative';
          containerRef.current.appendChild(mapDiv);
          mapRef.current = mapDiv;

          const map = new (window as any).google.maps.Map(mapDiv, {
            center: { lat: 48.206211, lng: 16.371459 },
            zoom: 17,
            mapId: "b1675efa7f9ddeb5c8c5150f",
            gestureHandling: "cooperative",
          });

          googleMapRef.current = map;

          (window as any).google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
            if (mountedRef.current) {
              setIsLoaded(true);
              setTimeout(() => {
                if (mountedRef.current && googleMapRef.current) {
                  (window as any).google.maps.event.trigger(map, 'resize');
                  map.setCenter({ lat: 48.206211, lng: 16.371459 });
                }
              }, 100);
            }
          });

          const markerContent = document.createElement("div");
          markerContent.style.display = "flex";
          markerContent.style.alignItems = "center";
          markerContent.style.justifyContent = "center";

          const img = document.createElement("img");
          img.src = logo;
          img.style.width = "40px";
          img.style.height = "auto";
          markerContent.appendChild(img);

          new (window as any).google.maps.marker.AdvancedMarkerElement({
            position: { lat: 48.206211, lng: 16.371459 },
            map,
            title: "SIRA Group - Kärntnerstraße 21-23/2/10, 1010 Wien",
            content: markerContent
          });

        }, 300);
      })
      .catch((err) => console.error("Fehler beim Laden der Google Maps API:", err));

    const handleResize = () => {
      if (mountedRef.current && googleMapRef.current) {
        (window as any).google.maps.event.trigger(googleMapRef.current, 'resize');
        googleMapRef.current.setCenter({ lat: 48.206211, lng: 16.371459 });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      console.log("Karte laden...")
      mountedRef.current = false;
      window.removeEventListener('resize', handleResize);
      
      // NEU: Sauberes Cleanup - Map-Container manuell entfernen
      if (mapRef.current && containerRef.current) {
        try {
          // Erst Google Maps cleanup
          if (googleMapRef.current) {
            (window as any).google?.maps?.event?.clearInstanceListeners?.(googleMapRef.current);
            googleMapRef.current = null;
          }
          // Dann DOM-Element entfernen
          if (containerRef.current.contains(mapRef.current)) {
            containerRef.current.removeChild(mapRef.current);
          }
          mapRef.current = null;
        } catch (err) {
          console.error("Cleanup error:", err);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="landing-map"
      style={{
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        overflow: "hidden",
        backgroundColor: "#e5e3df",
        position: "relative",
      }}
    >
      {!isLoaded && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#666",
          fontSize: "14px",
          fontFamily: "Amiko",
          zIndex: 10,
        }}>
          Karte wird geladen...
        </div>
      )}
    </div>
  );
};

export default StandortKarte;
