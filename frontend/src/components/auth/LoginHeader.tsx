import React from 'react';
import Image from 'next/image';
import {  HandThumbUpIcon } from '@heroicons/react/24/outline';

const LoginHeader = () => {
  return (
    <div className="absolute bg-white top-0 left-0 w-full justify-between p-2 flex items-center">
      <Image src="/logo.png" alt="OLSoftware Logo" width={60} height={40} />

      <div className='flex gap-x-5'>
      <div className='rounded-full bg-amber-950 text-white'>
        <HandThumbUpIcon className='w-8 p-1'/>
      </div>
      <span className="text-[20px] tracking-wider font-bold ">Beneficios por renovar</span>
      </div>
    </div>
  );
};

export default LoginHeader;