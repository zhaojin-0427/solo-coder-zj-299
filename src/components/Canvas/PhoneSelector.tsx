import { useDesignStore } from "@/store/useDesignStore";
import { phoneModels } from "@/data/phoneModels";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function PhoneSelector() {
  const phoneModelId = useDesignStore((state) => state.phoneModel);
  const setPhoneModel = useDesignStore((state) => state.setPhoneModel);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentModel = phoneModels.find((m) => m.id === phoneModelId) || phoneModels[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    setPhoneModel(id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft hover:shadow-pop transition-all duration-200 text-sm font-medium text-gray-700"
      >
        <span className="w-2 h-2 rounded-full bg-cream-200" />
        {currentModel.name}
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-pop overflow-hidden z-50 animate-scale-in">
          <div className="p-2">
            {phoneModels.map((model) => (
              <button
                key={model.id}
                onClick={() => handleSelect(model.id)}
                className={cn(
                  "w-full px-4 py-2.5 text-left rounded-lg text-sm transition-colors duration-150",
                  model.id === phoneModelId
                    ? "bg-cream-100 text-rose-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{model.name}</span>
                  <span className="text-xs text-gray-400">{model.brand}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
