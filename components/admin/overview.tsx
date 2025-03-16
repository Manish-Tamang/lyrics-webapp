"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 45,
  },
  {
    name: "Feb",
    total: 62,
  },
  {
    name: "Mar",
    total: 78,
  },
  {
    name: "Apr",
    total: 56,
  },
  {
    name: "May",
    total: 89,
  },
  {
    name: "Jun",
    total: 104,
  },
  {
    name: "Jul",
    total: 98,
  },
  {
    name: "Aug",
    total: 112,
  },
  {
    name: "Sep",
    total: 89,
  },
  {
    name: "Oct",
    total: 94,
  },
  {
    name: "Nov",
    total: 76,
  },
  {
    name: "Dec",
    total: 85,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

