import type { CaseTemplate, PhoneModel } from "@/types";

interface CaseRendererProps {
  phoneModel: PhoneModel;
  caseTemplate: CaseTemplate;
  caseColor: string;
}

export function CaseRenderer({ phoneModel, caseTemplate, caseColor }: CaseRendererProps) {
  const { cornerRadius, cameraArea } = phoneModel;

  const getCaseStyle = () => {
    switch (caseTemplate) {
      case "transparent":
        return {
          background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)",
          backdropFilter: "blur(10px)",
          border: "2px solid rgba(255,255,255,0.4)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)",
        };
      case "solid":
        return {
          background: caseColor,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        };
      case "mirror":
        return {
          background: "linear-gradient(135deg, #e8e8e8 0%, #ffffff 25%, #d0d0d0 50%, #ffffff 75%, #e8e8e8 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.8)",
        };
      default:
        return {};
    }
  };

  const renderCameraLenses = () => {
    const lenses = [];
    const lensSize = cameraArea.width * 0.22;
    const gap = cameraArea.width * 0.08;
    const totalWidth = lensSize * 2 + gap;
    const startX = cameraArea.x + (cameraArea.width - totalWidth) / 2;
    const startY = cameraArea.y + (cameraArea.height - lensSize * 2 - gap) / 2;

    for (let i = 0; i < Math.min(cameraArea.lensCount, 3); i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      lenses.push(
        <div
          key={`lens-${i}`}
          className="absolute rounded-full"
          style={{
            left: startX + col * (lensSize + gap),
            top: startY + row * (lensSize + gap),
            width: lensSize,
            height: lensSize,
            background: "radial-gradient(circle at 30% 30%, #4a4a4a 0%, #1a1a1a 60%, #000 100%)",
            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              top: "15%",
              left: "15%",
              width: "30%",
              height: "30%",
              background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
            }}
          />
        </div>
      );
    }

    if (cameraArea.lensCount > 3) {
      lenses.push(
        <div
          key="lens-extra"
          className="absolute rounded-full"
          style={{
            left: startX + (lensSize + gap) / 2,
            top: startY + lensSize + gap,
            width: lensSize,
            height: lensSize,
            background: "radial-gradient(circle at 30% 30%, #4a4a4a 0%, #1a1a1a 60%, #000 100%)",
            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.3)",
          }}
        />
      );
    }

    return lenses;
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        borderRadius: cornerRadius,
        ...getCaseStyle(),
      }}
    >
      <div
        className="absolute"
        style={{
          left: cameraArea.x,
          top: cameraArea.y,
          width: cameraArea.width,
          height: cameraArea.height,
          borderRadius: cameraArea.cornerRadius,
          background: "rgba(30, 30, 30, 0.9)",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        {renderCameraLenses()}
      </div>

      {caseTemplate === "mirror" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.1) 100%)",
            borderRadius: cornerRadius,
          }}
        />
      )}
    </div>
  );
}
