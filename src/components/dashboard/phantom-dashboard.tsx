'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]();:<>/?|';
const generateRandomString = (length: number) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateChartData = () => {
    const data = [];
    let lastValue = 500;
    for (let i = 0; i < 15; i++) {
        lastValue += Math.random() * 200 - 100;
        if(lastValue < 0) lastValue = Math.random() * 100;
        data.push({ name: `T-${15-i}`, views: Math.round(lastValue) });
    }
    return data;
}

const CodeLine = () => {
    const length = useMemo(() => 40 + Math.floor(Math.random() * 40), []);
    const [code, setCode] = useState(generateRandomString(length));

    useEffect(() => {
        const interval = setInterval(() => {
            setCode(generateRandomString(length));
        }, 100 + Math.random() * 200);
        return () => clearInterval(interval);
    }, [length]);
    
    return <p className="text-xs whitespace-nowrap overflow-hidden">{code}</p>
}


export function PhantomDashboard() {
  const [timer, setTimer] = useState(0);
  const [nextOrder, setNextOrder] = useState({ id: 103, countdown: 15 });
  const [chartData, setChartData] = useState(generateChartData());


  useEffect(() => {
    const timerInterval = setInterval(() => setTimer(prev => prev + 1), 1000);
    const orderInterval = setInterval(() => {
        setNextOrder(prev => {
            if (prev.countdown <= 1) {
                setChartData(generateChartData());
                return { id: prev.id + 1, countdown: 15 + Math.floor(Math.random() * 10) }
            }
            return { ...prev, countdown: prev.countdown - 1 };
        })
    }, 1000);

    return () => {
        clearInterval(timerInterval);
        clearInterval(orderInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="w-full h-full max-w-4xl font-mono text-primary p-4 rounded-lg border border-primary/20 bg-black/50 backdrop-blur-sm shadow-[0_0_20px_rgba(var(--primary-values),0.2)] flex flex-col gap-4">
       {/* Header */}
        <div className="flex justify-between items-center border-b border-primary/20 pb-2">
            <h2 className="text-xl font-bold animate-flicker-glitch">[PHANTOM_CORE_v2.1]</h2>
            <div className="text-lg">{formatTime(timer)}</div>
        </div>

        {/* Main Content */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
            {/* Left Panel: Code & Status */}
            <div className="flex flex-col gap-4">
                <Card className="bg-black/50 border-primary/20 flex-grow overflow-hidden">
                    <div className="p-2 h-full flex flex-col">
                        <p className="text-sm text-primary/70 pb-2 border-b border-primary/20">&gt; Realtime Log Stream...</p>
                        <div className="flex-grow overflow-hidden relative mask-gradient">
                            <div className="h-full flex flex-col gap-1 py-2">
                                {Array.from({length: 20}).map((_, i) => <CodeLine key={i} />)}
                            </div>
                        </div>
                    </div>
                </Card>
                <Card className="bg-black/50 border-primary/20 p-4 flex justify-between items-center">
                    <p className="text-sm">Next Order:</p>
                    <p className="text-lg font-bold">#{nextOrder.id}</p>
                    <p className="text-sm">in</p>
                    <p className="text-lg font-bold">{nextOrder.countdown}s</p>
                </Card>
            </div>

            {/* Right Panel: Chart */}
            <Card className="bg-black/50 border-primary/20 p-4 flex flex-col relative">
                <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-sm">Sensor: Scanned for Whop ID</p>
                    <p className="text-2xl font-bold mt-2 text-green-400 shadow-[0_0_10px_#22c55e]">SAFE FOR NEXT ORDER</p>
                </div>
                <p className="text-sm text-primary/70 pb-2">&gt; Live View Rate</p>
                <div className="flex-grow w-full opacity-30">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.2)" />
                            <XAxis dataKey="name" stroke="hsl(var(--primary))" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis stroke="hsl(var(--primary))" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--primary) / 0.5)',
                                    color: 'hsl(var(--foreground))',
                                    fontFamily: 'monospace'
                                }}
                            />
                            <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
        <style jsx>{`
            .mask-gradient {
                -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
                mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
            }
        `}</style>
    </div>
  );
}
