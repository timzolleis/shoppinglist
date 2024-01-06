export type Color = {
  red: number,
  green: number,
  blue: number,
  alpha?: number

}

export function rgbToHex({ red, green, blue }: Color) {
  return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
}

export function hexToRgb(hex: string) {
  const red = parseInt(hex.slice(1, 3), 16),
    green = parseInt(hex.slice(3, 5), 16),
    blue = parseInt(hex.slice(5, 7), 16);
  return { red, green, blue };
}

export function getBackgroundColor(textColor: Color) {
  return {
    ...textColor,
    alpha: 0.18
  };
}


export function getRandomColor(): Color {
  return {
    red: Math.floor(Math.random() * 255),
    green: Math.floor(Math.random() * 255),
    blue: Math.floor(Math.random() * 255),
    alpha: 1
  };
}


export function colorToCss(color: Color) {
  return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
}