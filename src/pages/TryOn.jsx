import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Shirt, Upload, Move3d, Layers, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate, useLocation } from 'react-router-dom';

export const TryOn = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state?.product;

    const [mode, setMode] = useState('camera'); // camera | upload | model

    return (
        <div className="h-screen bg-black flex flex-col relative text-white">
            {/* Viewport / Canvas */}
            <div className="flex-1 relative bg-neutral-900 rounded-b-[40px] overflow-hidden">
                {/* Live Camera Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {product ? (
                        <img src={product.image} className="w-full h-full object-cover opacity-50 absolute inset-0" />
                    ) : (
                        <div className="text-center p-8 opacity-50">
                            <Camera size={64} className="mx-auto mb-4 text-violet-500" />
                            <p>Camera permission required</p>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                </div>

                {/* Header */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <button onClick={() => navigate(-1)} className="p-2 bg-black/40 backdrop-blur rounded-full">
                        <XIcon />
                    </button>
                    <div className="bg-black/40 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                        AI Magic Mirror
                    </div>
                    <button className="p-2 bg-black/40 backdrop-blur rounded-full">
                        <Move3d size={20} />
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="h-[40vh] bg-black text-white p-6 pt-8 flex flex-col justify-between">

                {/* Toggle Modes */}
                <div className="flex justify-center mb-6">
                    <div className="bg-neutral-900 p-1 rounded-full flex gap-1 border border-white/10">
                        {['Live', 'Photo', 'Model'].map((m) => (
                            <button
                                key={m}
                                className="px-6 py-2 rounded-full text-xs font-bold transition-all bg-neutral-800 hover:bg-neutral-700"
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {product && (
                    <div className="flex gap-4 items-center bg-neutral-900 p-3 rounded-2xl border border-white/10 mb-4">
                        <img src={product.image} className="w-12 h-12 rounded-lg object-cover bg-white" />
                        <div className="flex-1">
                            <p className="text-sm font-bold truncate">{product.name}</p>
                            <p className="text-xs text-neutral-400">Position the garment to align</p>
                        </div>
                        <button className="p-2 bg-white text-black rounded-full">
                            <Layers size={18} />
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between gap-6">
                    <button className="flex flex-col items-center gap-1 text-xs text-neutral-400">
                        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center border border-white/5">
                            <Upload size={20} />
                        </div>
                        Upload
                    </button>

                    <button className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative group">
                        <div className="w-16 h-16 bg-white rounded-full group-hover:scale-95 transition-transform" />
                    </button>

                    <button className="flex flex-col items-center gap-1 text-xs text-neutral-400">
                        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center border border-white/5">
                            <Shirt size={20} />
                        </div>
                        Outfit
                    </button>
                </div>

            </div>
        </div>
    );
};

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
)
