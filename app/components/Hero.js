import React from "react";

const Hero = () => {
  return (
    <div className="h-dvh  p-4 font-serif flex justify-center items-center gap-10">
      <div className="space-y-8">
        <h1 className="text-[64px] text-center font-extrabold leading-[72px] ">Simplify Payroll with Our Easy <span className="text-primary">Payslip Generator</span></h1>
        <p className="font-serif text-2xl text-center text-slate-900">Our Payslip Generator is a fast, easy-to-use tool designed to simplify payroll management for businesses and employees. With customizable templates and automatic calculations for taxes, deductions, and benefits, you can create professional, compliant payslips in just a few clicks.</p>

        <div className="font-mono text-center">
          <button className="bg-primary font-mono text-xl text-white px-4 py-2 rounded-full hover:border-solid border-2 hover:border-primary hover:bg-white hover:text-slate-400 ">Generate Payslip</button>
        </div>
      </div>
     
    </div>
  );
};

export default Hero;
