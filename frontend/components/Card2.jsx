"use client"
import React from 'react';

const HalfWidthFullHeightCard = (props) => {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full w-full max-w-2xl mx-auto transition-all duration-300 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)] hover:border-red-500/30">
      <div className="p-6 border-b border-white/10 bg-white/5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Escalated Cases
        </h2>
      </div>
      <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar h-[600px]">
        {props.mappedArray2.map((item, outerIndex) => (
          <div key={outerIndex} className="space-y-4">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white">
                    {item.user.split(' ')[1]}
                </div>
                <h3 className="text-red-400 font-medium text-sm">{item.user}</h3>
            </div>
            <div className="space-y-3 pl-4 border-l-2 border-white/5">
                {item.innerArray.map((message, innerIndex) => (
                <div key={`${outerIndex}-${innerIndex}`} className={`p-3 rounded-lg text-sm ${innerIndex % 2 === 0 ? 'bg-white/10 text-gray-200 ml-auto max-w-[90%] rounded-tr-none' : 'bg-red-500/10 text-white max-w-[90%] rounded-tl-none border border-red-500/20'}`}>
                    <span className="text-xs opacity-50 block mb-1">{message.sender}</span>
                    <p>{message.message}</p>
                </div>
                ))}
            </div>
            {outerIndex < props.mappedArray2.length - 1 && <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};  

export default HalfWidthFullHeightCard;
