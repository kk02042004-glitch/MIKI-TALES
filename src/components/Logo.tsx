import React from 'react';
import { usePortfolio } from '../store/PortfolioContext';

interface LogoProps {
  size?: number; // size in pixels e.g. 40, 48, 64
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 44, className = '', showText = false }) => {
  const { data } = usePortfolio();
  const customLogoUrl = data.brand.customLogoUrl;

  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      <div 
        className="relative rounded-full overflow-hidden shrink-0 flex items-center justify-center select-none"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {customLogoUrl && customLogoUrl.trim() !== '' ? (
          <img
            src={customLogoUrl}
            alt="MK Tales Official Brand Logo"
            className="w-full h-full object-cover rounded-full"
            loading="eager"
          />
        ) : (
          /* Exact vector rendering faithful to the uploaded MK Tales logo: Deep navy blue circle (#000066) with vibrant yellow (#FFFF00) chunky 2D animator lettering */
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full block"
            aria-label="MK Tales Logo"
          >
            {/* Deep navy blue background circle inspired by original logo */}
            <circle cx="250" cy="250" r="250" fill="#000066" />

            {/* Top row: Stylized 2D animator bubble letters "M K" / "MKI" */}
            <g fill="#FFFF00">
              {/* 'M' Letter - Plump animated bulbous silhouette */}
              <path d="M 95 195 C 95 145 125 105 160 105 C 185 105 198 125 208 152 C 218 125 235 105 260 105 C 295 105 320 145 320 195 C 320 220 310 248 290 248 C 275 248 270 230 270 205 C 270 175 260 150 248 150 C 238 150 230 172 230 198 L 230 242 C 230 252 222 258 212 258 C 202 258 195 252 195 242 L 195 198 C 195 172 188 150 178 150 C 165 150 155 175 155 205 C 155 230 150 248 135 248 C 115 248 95 220 95 195 Z" />

              {/* 'K' Letter - Stylized chunky 2D cartoon letterform */}
              <path d="M 330 105 C 342 105 352 115 352 128 L 352 170 C 365 150 382 118 402 110 C 418 104 430 115 428 130 C 426 142 408 165 390 185 C 412 205 432 232 425 250 C 420 262 405 265 392 254 C 375 240 360 215 352 202 L 352 245 C 352 255 342 262 330 262 C 318 262 310 255 310 245 L 310 128 C 310 115 318 105 330 105 Z" />

              {/* Bottom row: "tales" in bubbly animated typography */}
              {/* 't' */}
              <path d="M 125 320 L 110 320 C 102 320 98 312 98 305 C 98 298 102 292 110 292 L 125 292 L 125 275 C 125 265 132 260 140 260 C 148 260 155 265 155 275 L 155 292 L 175 292 C 182 292 188 298 188 305 C 188 312 182 320 175 320 L 155 320 L 155 355 C 155 372 165 378 178 375 C 185 373 190 380 188 388 C 185 396 172 405 155 402 C 135 398 125 382 125 355 Z" />

              {/* 'a' */}
              <path d="M 235 345 C 235 325 220 310 198 310 C 175 310 160 328 160 355 C 160 382 175 402 200 402 C 215 402 225 395 232 385 L 232 395 C 232 402 238 408 245 408 C 252 408 258 402 258 395 L 258 335 C 258 318 250 310 235 310 C 228 310 220 314 218 322 C 216 328 222 334 228 334 C 232 334 235 338 235 345 Z M 232 355 C 232 375 220 385 205 385 C 190 385 182 372 182 355 C 182 338 190 328 205 328 C 220 328 232 338 232 355 Z" />

              {/* 'l' */}
              <path d="M 275 265 C 285 265 292 272 292 282 L 292 388 C 292 398 285 405 275 405 C 265 405 258 398 258 388 L 258 282 C 258 272 265 265 275 265 Z" />

              {/* 'e' */}
              <path d="M 345 350 C 345 325 330 310 308 310 C 285 310 270 328 270 355 C 270 385 285 402 312 402 C 328 402 340 392 344 380 C 346 374 340 368 335 368 C 330 368 326 372 322 378 C 315 385 308 388 300 388 C 290 388 282 378 282 362 L 342 362 C 344 362 345 358 345 350 Z M 284 348 C 286 335 295 325 308 325 C 320 325 328 335 330 348 Z" />

              {/* 's' */}
              <path d="M 390 335 C 385 325 375 320 365 320 C 352 320 345 328 345 338 C 345 350 355 355 370 360 C 392 368 405 378 405 395 C 405 415 385 425 362 425 C 345 425 332 418 328 405 C 325 398 330 392 338 392 C 342 392 346 395 350 402 C 355 408 365 412 375 412 C 388 412 394 405 394 395 C 394 385 385 380 370 375 C 348 368 335 358 335 340 C 335 320 352 308 372 308 C 385 308 398 315 402 325 C 405 332 400 338 392 338 C 390 338 390 335 390 335 Z" />
            </g>
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-base font-bold tracking-tight text-white leading-tight">
            {data.brand.brandName}
          </span>
          <span className="text-xs text-slate-400 font-medium tracking-normal">
            {data.brand.creatorName} · {data.brand.profession}
          </span>
        </div>
      )}
    </div>
  );
};
