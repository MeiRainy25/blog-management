"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type ColorPickerProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;

  /**
   * 颜色代码展示位置
   * - outside: 默认，触发区展示颜色块 + 输入框
   * - inset: 触发区仅展示颜色块，输入框放到popover内部
   */
  showColor?: "inset" | "outside";

  /**
   * 预设颜色面板
   */
  presets?: string[];

  /**
   * 是否允许编辑输入框
   */
  editable?: boolean;

  className?: string;
};

const DEFAULT_PRESETS = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
];

function normalizeHex(input: string) {
  const v = (input ?? "").trim();
  if (!v) return "";
  if (v.startsWith("#")) return v;
  return `#${v}`;
}

function isValidHexColor(input: string) {
  const v = normalizeHex(input);
  return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(v);
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function hsvToHex(h: number, s: number, v: number) {
  // h: 0-360, s/v: 0-1
  const hh = ((h % 360) + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = v - c;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hh < 60) {
    r = c;
    g = x;
  } else if (hh < 120) {
    r = x;
    g = c;
  } else if (hh < 180) {
    g = c;
    b = x;
  } else if (hh < 240) {
    g = x;
    b = c;
  } else if (hh < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHsv(hex: string): { h: number; s: number; v: number } | null {
  const v = normalizeHex(hex);
  if (!isValidHexColor(v)) return null;

  const raw =
    v.length === 4 ? `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}` : v;

  const r = parseInt(raw.slice(1, 3), 16) / 255;
  const g = parseInt(raw.slice(3, 5), 16) / 255;
  const b = parseInt(raw.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = 60 * (((g - b) / delta) % 6);
    else if (max === g) h = 60 * ((b - r) / delta + 2);
    else h = 60 * ((r - g) / delta + 4);
  }
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : delta / max;
  const vv = max;
  return { h, s, v: vv };
}

export function ColorPicker({
  value,
  defaultValue = "#000000",
  onChange,
  presets = DEFAULT_PRESETS,
  editable = true,
  showColor = "inset",
  className,
}: ColorPickerProps) {
  const isControlled = value !== undefined;
  const [inner, setInner] = React.useState<string>(defaultValue);

  const [open, setOpen] = React.useState(false);

  const current = isControlled ? (value ?? "") : inner;
  const normalized = normalizeHex(current);
  const valid = isValidHexColor(normalized);
  const previewColor = valid ? normalized : undefined;

  // HSV 状态（用于面板交互）；无效色则 fallback 到 defaultValue
  const hsv = React.useMemo(() => {
    return (
      hexToHsv(normalized) ?? hexToHsv(defaultValue) ?? { h: 0, s: 0, v: 0 }
    );
  }, [normalized, defaultValue]);

  const [hue, setHue] = React.useState(hsv.h);
  const [sv, setSv] = React.useState({ s: hsv.s, v: hsv.v });

  // 当外部 value 改变时，同步面板状态
  React.useEffect(() => {
    setHue(hsv.h);
    setSv({ s: hsv.s, v: hsv.v });
  }, [hsv.h, hsv.s, hsv.v]);

  const commit = React.useCallback(
    (next: string) => {
      if (!isControlled) setInner(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const commitHsv = React.useCallback(
    (nextHue: number, nextS: number, nextV: number) => {
      const nextHex = hsvToHex(nextHue, nextS, nextV);
      commit(nextHex);
    },
    [commit],
  );

  const svRef = React.useRef<HTMLDivElement | null>(null);
  const hueRef = React.useRef<HTMLDivElement | null>(null);

  const updateSvByPointer = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = svRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clamp01((clientX - rect.left) / rect.width);
      const y = clamp01((clientY - rect.top) / rect.height);
      const nextS = x;
      const nextV = 1 - y;
      setSv({ s: nextS, v: nextV });
      commitHsv(hue, nextS, nextV);
    },
    [commitHsv, hue],
  );

  const updateHueByPointer = React.useCallback(
    (clientX: number) => {
      const el = hueRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clamp01((clientX - rect.left) / rect.width);
      const nextHue = x * 360;
      setHue(nextHue);
      commitHsv(nextHue, sv.s, sv.v);
    },
    [commitHsv, sv.s, sv.v],
  );

  const svCursorLeft = `${sv.s * 100}%`;
  const svCursorTop = `${(1 - sv.v) * 100}%`;
  const hueCursorLeft = `${(hue / 360) * 100}%`;

  const colorInput = (
    <Input
      value={normalized}
      onChange={(e) => {
        if (!editable) return;
        commit(e.target.value);
      }}
      placeholder="#RRGGBB"
      disabled={!editable}
      className={cn(!valid && normalized ? "border-destructive" : undefined)}
    />
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("flex items-center gap-2", className)}>
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 p-0"
            aria-label={
              previewColor ? `当前颜色 ${previewColor}` : "当前颜色无效"
            }
          >
            <span
              className="h-6 w-6 rounded-md border"
              style={
                previewColor ? { backgroundColor: previewColor } : undefined
              }
            />
          </Button>

          {showColor === "outside" ? (
            <div className="flex-1 min-w-0">{colorInput}</div>
          ) : null}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-72" align="start" side="bottom">
        {/* 上半部分：正方形色盘(S/V) + Hue 选择条 */}
        <div className="flex flex-col gap-3">
          <div
            ref={svRef}
            className="relative aspect-square w-full overflow-hidden rounded-md border cursor-crosshair"
            style={{ backgroundColor: hsvToHex(hue, 1, 1) }}
            onPointerDown={(e) => {
              (e.currentTarget as HTMLDivElement).setPointerCapture(
                e.pointerId,
              );
              updateSvByPointer(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (e.buttons !== 1) return;
              updateSvByPointer(e.clientX, e.clientY);
            }}
          >
            {/* 白色渐变（饱和度） */}
            <div className="absolute inset-0 bg-linear-to-r from-white to-transparent" />
            {/* 黑色渐变（明度） */}
            <div className="absolute inset-0 bg-linear-to-t from-black to-transparent" />

            {/* 游标 */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: svCursorLeft, top: svCursorTop }}
            >
              <div className="h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm" />
            </div>
          </div>

          <div
            ref={hueRef}
            className="relative h-3 w-full rounded-full border overflow-hidden cursor-pointer"
            style={{
              background:
                "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
            }}
            onPointerDown={(e) => {
              (e.currentTarget as HTMLDivElement).setPointerCapture(
                e.pointerId,
              );
              updateHueByPointer(e.clientX);
            }}
            onPointerMove={(e) => {
              if (e.buttons !== 1) return;
              updateHueByPointer(e.clientX);
            }}
            aria-label="色相选择"
          >
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: hueCursorLeft }}
            >
              <div className="h-4 w-2 rounded-sm border bg-background shadow-sm" />
            </div>
          </div>
        </div>

        {/* inset 模式：颜色代码输入放在色盘下面、预设色上面，占据整行 */}
        {showColor === "inset" ? (
          <div className="mt-2">{colorInput}</div>
        ) : null}

        {/* 下半部分：预设色块 */}
        <div className="mt-1 flex flex-wrap gap-2">
          {presets.map((c) => {
            const selected =
              normalizeHex(c).toLowerCase() === normalized.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                className={cn(
                  "h-6 w-6 rounded-md border",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected ? "ring-2 ring-ring" : "hover:opacity-90",
                )}
                style={{ backgroundColor: c }}
                onClick={() => commit(c)}
                title={c}
                aria-label={`选择颜色 ${c}`}
              />
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ColorPicker;
