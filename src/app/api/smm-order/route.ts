import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const body = await req.json();
      console.log("Incoming POST body:", body);
  
      const { link, quantity, serviceId } = body;
  
      if (!link || !quantity || !serviceId) {
        console.log("Missing fields:", { link, quantity, serviceId });
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      if (!process.env.SMM_API_KEY) {
        console.log("SMM_API_KEY is missing!");
        return NextResponse.json({ error: "Missing SMM_API_KEY" }, { status: 500 });
      }
  
      const params = new URLSearchParams({
        key: process.env.SMM_API_KEY,
        action: "add",
        service: String(serviceId),
        link,
        quantity: String(quantity),
      });
  
      const response = await fetch('https://smmsocialmedia.in/api/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
  
      const text = await response.text(); // log raw response
      console.log("Raw SMM API response:", text);
  
      const data = JSON.parse(text); // safer parse
  
      if (data.error) {
        console.log("SMM API returned error:", data.error);
        return NextResponse.json({ error: data.error }, { status: 500 });
      }
  
      return NextResponse.json(data);
    } catch (err) {
      console.error("POST /dashboard/whop-phantom failed:", err);
      return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
    }
  }
  
