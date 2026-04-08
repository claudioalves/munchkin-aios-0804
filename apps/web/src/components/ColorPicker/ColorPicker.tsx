import { AVATAR_COLORS } from '@munchkin/shared';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-2">
      {AVATAR_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className="w-8 h-8 rounded-full transition-transform hover:scale-110"
          style={{ backgroundColor: color }}
          aria-label={`Selecionar cor ${color}`}
          aria-pressed={value === color}
        >
          {value === color && (
            <span className="flex items-center justify-center w-full h-full text-surface-base text-xs font-bold">
              ✓
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
