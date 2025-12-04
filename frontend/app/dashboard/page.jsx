"use client";
import { useState, useEffect } from "react";
import Nav from "@/components/Navbar";
import Card from "@/components/Card";
import Card2 from "@/components/Card2";
import { GLOBAL_VARIABLE_SATISFIED, GLOBAL_VARIABLE_NOT_SATISFIED } from "@/../config";

export default function Dashboard() {
  const mappedArray1 = GLOBAL_VARIABLE_SATISFIED.map((innerArray, index) => {
    const userString = `User ${index + 1}`;
    return {
      user: userString,
      innerArray: innerArray
    };
  });

  const mappedArray2 = GLOBAL_VARIABLE_NOT_SATISFIED.map((innerArray, index) => {
    const userString = `User ${index + 1}`;
    return {
      user: userString,
      innerArray: innerArray
    };
  });

  return (
    <main className="min-h-screen w-full flex flex-col">
      <Nav />
      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-6 pb-12">
        <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-white">
                Dashboard
            </h1>
            <p className="text-gray-400">Monitor customer satisfaction and escalated cases.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[700px]">
            <div className="h-full">
                <Card mappedArray1={mappedArray1} />
            </div>
            <div className="h-full">
                <Card2 mappedArray2={mappedArray2} />
            </div>
        </div>
      </div>
    </main>
  );
}
