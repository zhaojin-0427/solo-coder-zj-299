import { X, Download, Image, FileText } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportPNG: () => void;
}

export function ExportModal({ isOpen, onClose, onExportPNG }: ExportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-pop w-full max-w-sm mx-4 animate-scale-in">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">导出预览图</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <button
            onClick={() => {
              onExportPNG();
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl hover:from-rose-100 hover:to-pink-100 transition-all group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Image className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800">PNG 图片</p>
              <p className="text-xs text-gray-500 mt-0.5">高清透明背景图片</p>
            </div>
            <Download className="w-5 h-5 text-gray-400 ml-auto" />
          </button>

          <button
            disabled
            className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl opacity-60 cursor-not-allowed"
          >
            <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-500">PDF 文档</p>
              <p className="text-xs text-gray-400 mt-0.5">即将推出</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
