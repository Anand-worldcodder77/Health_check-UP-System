import React from 'react';

const ReceiptTemplate = ({ data }) => {
  return (
    <div id="printable-receipt" className="p-8 bg-white text-black font-sans w-[80mm] border border-dashed border-slate-300">
      <div className="text-center mb-4 border-b pb-2">
        <h2 className="text-xl font-black uppercase tracking-tight">CITY LABS</h2>
        <p className="text-[10px]">123 Health Street, Medical Plaza</p>
        <p className="text-[10px]">PH: +91 9876543210</p>
      </div>

      <div className="space-y-2 text-[12px]">
        <div className="flex justify-between">
          <span className="font-bold">Date:</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Patient:</span>
          <span className="uppercase">{data.userName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">ID:</span>
          <span>#{data._id?.slice(-6)}</span>
        </div>
        <div className="border-t border-b py-2 my-2 font-black text-center uppercase tracking-widest bg-slate-50">
          {data.selectedPackage}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-[9px] italic">Thank you for choosing City Labs</p>
        <div className="mt-4 border-t pt-2">
          <p className="text-[8px] opacity-50 font-mono">System Gen: {data._id}</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptTemplate;