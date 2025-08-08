'use client';
import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  label: string;
  items: { label: string; href: string }[];
}

export default function Dropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center 3 rounded-sm text-737382 px-[10px] py-[8px] hover:cursor-pointer"
      >
        {label}
        <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" className="-mr-1 size-5 text-414146">
      <path d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" fillRule="evenodd" />
    </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded text-gray-700 z-50">
          {items.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="block px-4 py-2 hover:bg-gray-100 text-left text-sm"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}



