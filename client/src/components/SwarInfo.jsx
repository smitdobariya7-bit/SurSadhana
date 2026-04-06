import React from 'react';

const SwarInfo = ({ note = 'Ma', variant = 'tivra' }) => {
  const isTivra = /tivra/i.test(variant) || variant === 'sharp';

  return (
    <div className="mb-8 p-4 bg-white/3 rounded-lg border border-white/6">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 font-semibold text-lg">
          {note}{isTivra ? '♯' : ''}
        </div>
        <div>
          <div className="text-white font-semibold">{isTivra ? 'Tivra ' : ''}{note}</div>
          <div className="text-sm text-gray-300 mt-1 max-w-xl">
            {isTivra ? (
              <>
                Tivra Ma (sharp Ma) — इस नोट को तेज़/ऊपर की ओर उठाकर गाया जाता है। Practice tip: पहले धीमी गति में Tanpura के साथ Ma(tivra) को सुनकर match करें, फिर अलंकारों में धीरे-धीरे शामिल करें।
              </>
            ) : (
              <>Shuddha {note} — sing the natural {note} clearly and use it as pitch reference.</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwarInfo;
