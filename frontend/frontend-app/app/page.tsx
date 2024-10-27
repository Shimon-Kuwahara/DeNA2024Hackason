"use client";
import nookies from "nookies";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Link from "next/link";
import Image from "next/image";
import timer from "../public/images/timer-white.png";
import box from "../public/images/box-empty.png";
import treasure from "../public/images/treasure-yellow.png";

const sampleMarkers: ItemType[] = [
  {
    lat: 35.6895,
    lng: 139.6917,
    key: "shinjuku",
    status: "openable",
    id: "IDshinjyuku",
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    key: "shibuya",
    status: "unopenable",
    id: "IDshibuya",
  },
  {
    lat: 35.7023,
    lng: 139.7745,
    key: "akihabara",
    status: "opened",
    id: "IDakihabara",
  },
];

interface ItemType {
  lat: number;
  lng: number;
  key: string;
  status: string;
  id: string;
}

const Items: ItemType[] = sampleMarkers;

const Map = ({
  currentPosition,
}: {
  currentPosition: { lat: number; lng: number };
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // useCallback をコンポーネントのトップレベルで定義
  const onLoad = useCallback(
    (map: google.maps.Map) => {
      const bounds = new window.google.maps.LatLngBounds(currentPosition);
      map.fitBounds(bounds);
      map.setZoom(10);
    },
    [currentPosition],
  );

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const openableIcon: google.maps.Icon = {
    url: treasure.src,
    scaledSize: new google.maps.Size(60, 60),
  };

  const opendIcon: google.maps.Icon = {
    url: box.src,
    scaledSize: new google.maps.Size(60, 60),
  };

  const unopenableIcon: google.maps.Icon = {
    url: timer.src,
    scaledSize: new google.maps.Size(60, 60),
  };

  const currentIcon = {
    path: "M 0,0 m -10, 0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0",
    scale: 1,
    fillColor: "#4285F4",
    fillOpacity: 1,
    strokeColor: "#FFFFFF",
    strokeWeight: 2,
  };

  return (
    <GoogleMap
      onLoad={onLoad}
      mapContainerStyle={containerStyle}
      center={currentPosition}
      zoom={10}
    >
      <Marker position={currentPosition} icon={currentIcon} />
      {Items.map((marker, index) => (
        <Marker
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
          icon={
            marker.status === "openable"
              ? openableIcon
              : marker.status === "unopenable"
                ? unopenableIcon
                : opendIcon
          }
        />
      ))}
    </GoogleMap>
  );
};

export default function Home() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const cookies = nookies.get(null);
    const userId = cookies.user_id || null;

    if (!userId) {
      router.push("/login");
    } else {
      setCurrentUserId(userId);
      setLoading(false);
    }

    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        () => {
          setCurrentPosition({ lat: 35.6762, lng: 139.6503 });
        },
      );
    }
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (!currentUserId) return null;

  fetchAndDisplayCapsules(currentUserId);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="flex h-10 w-full items-center justify-center rounded-lg bg-gray-800 text-2xl text-white shadow-lg">
        ホームページ
      </h1>
      <p className="flex w-full items-center justify-center">
        Welcome, {currentUserId}
      </p>
      {currentPosition && <Map currentPosition={currentPosition} />}

      <div className="h-full w-full gap-2 rounded-lg bg-gray-300 p-2 shadow-lg">
        <h1 className="flex items-center justify-center text-lg">
          開けられる一覧
        </h1>
        <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-white p-2">
          {Items.filter((item) => item.status === "openable").map(
            (item, index) => (
              <Link
                href={`/time-capsules/${item.id}`}
                key={index}
                className="flex items-center justify-center"
              >
                <p>{item.key}</p>
              </Link>
            ),
          )}
        </div>
      </div>
      <div className="h-full w-full gap-2 rounded-lg bg-gray-300 p-2 shadow-lg">
        <h1 className="flex items-center justify-center text-lg">開けた一覧</h1>{" "}
        <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-white p-2">
          {Items.filter((item) => item.status === "opened").map(
            (item, index) => (
              <Link
                href={`/time-capsules/${item.id}`}
                key={index}
                className="flex items-center justify-center"
              >
                <p>{item.key}</p>
              </Link>
            ),
          )}
        </div>
      </div>
      <div className="h-full w-full gap-2 rounded-lg bg-gray-300 p-2 shadow-lg">
        <h1 className="flex items-center justify-center text-lg">埋めた一覧</h1>{" "}
        <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-white p-2">
          {Items.filter((item) => item.status === "unopenable").map(
            (item, index) => (
              <Link
                href={`/time-capsules/${item.id}`}
                key={index}
                className="flex items-center justify-center"
              >
                <p>{item.key}</p>
              </Link>
            ),
          )}
        </div>
      </div>

      <a
        href="/bury"
        className="flex items-center justify-center"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "100px",
          height: "100px",
          padding: "10px 15px",
          backgroundColor: "#6600cc", //'#BFECFF',
          color: "white",
          border: "none",
          borderRadius: "50%",
          textAlign: "center",
        }}
      >
        <Image
          height={50}
          width={50}
          src="/images/bury_white.png"
          alt="bury_icon"
        />
      </a>
    </div>
  );
}

async function fetchAndDisplayCapsules(currentUserId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/capsules/${encodeURIComponent(currentUserId)}`,
    );
    if (!response.ok) throw new Error("Capsule creation failed");
    const jsonData = await response.json();
    console.log(jsonData);
  } catch (error) {
    console.error("Error:", error);
  }
}
