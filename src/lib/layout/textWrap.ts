type FontWeight = 'regular' | 'bold';
const DEFAULT_FONT_FAMILY = 'Helvetica, Arial, sans-serif';
let measurementContext: CanvasRenderingContext2D | null | undefined;

function estimateCharacterWidth(character: string): number {
  if (character === ' ') {
    return 0.32;
  }

  if ('.,;:!|'.includes(character)) {
    return 0.28;
  }

  if ('()[]{}'.includes(character)) {
    return 0.36;
  }

  if ('/-'.includes(character)) {
    return 0.4;
  }

  if (/[A-Z]/.test(character)) {
    return 0.7;
  }

  if (/[0-9]/.test(character)) {
    return 0.56;
  }

  return 0.54;
}

function getMeasurementContext(): CanvasRenderingContext2D | null {
  if (measurementContext !== undefined) {
    return measurementContext;
  }

  if (typeof document === 'undefined') {
    measurementContext = null;
    return measurementContext;
  }

  const canvas = document.createElement('canvas');
  measurementContext = canvas.getContext('2d');
  return measurementContext;
}

function estimateTextWidthFallback(
  text: string,
  fontSize: number,
  weight: FontWeight = 'regular'
): number {
  const weightFactor = weight === 'bold' ? 1.06 : 1;

  return (
    text.split('').reduce((total, character) => {
      return total + estimateCharacterWidth(character);
    }, 0) *
    fontSize *
    weightFactor
  );
}

export function estimateTextWidth(
  text: string,
  fontSize: number,
  weight: FontWeight = 'regular',
  fontFamily: string = DEFAULT_FONT_FAMILY
): number {
  const context = getMeasurementContext();

  if (!context) {
    return estimateTextWidthFallback(text, fontSize, weight);
  }

  context.font = `${weight === 'bold' ? '700' : '400'} ${fontSize}px ${fontFamily}`;
  return context.measureText(text).width;
}

function splitTokenToFit(
  token: string,
  maxWidth: number,
  fontSize: number,
  weight: FontWeight,
  fontFamily: string
): string[] {
  const slices: string[] = [];
  let start = 0;

  while (start < token.length) {
    let end = start + 1;
    let bestEnd = end;

    while (end <= token.length) {
      const slice = token.slice(start, end);
      if (estimateTextWidth(slice, fontSize, weight, fontFamily) > maxWidth) {
        break;
      }
      bestEnd = end;
      end += 1;
    }

    if (bestEnd === start) {
      bestEnd = start + 1;
    }

    slices.push(token.slice(start, bestEnd));
    start = bestEnd;
  }

  return slices;
}

export function wrapTextByWords(
  text: string,
  maxWidth: number,
  fontSize: number,
  weight: FontWeight = 'regular',
  fontFamily: string = DEFAULT_FONT_FAMILY
): string[] {
  const normalizedText = text.trim().replace(/\s+/g, ' ');

  if (!normalizedText) {
    return [''];
  }

  const words = normalizedText.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const segments =
      estimateTextWidth(word, fontSize, weight, fontFamily) > maxWidth
        ? splitTokenToFit(word, maxWidth, fontSize, weight, fontFamily)
        : [word];

    for (const segment of segments) {
      const candidate = currentLine ? `${currentLine} ${segment}` : segment;

      if (
        currentLine &&
        estimateTextWidth(candidate, fontSize, weight, fontFamily) > maxWidth
      ) {
        lines.push(currentLine);
        currentLine = segment;
        continue;
      }

      currentLine = candidate;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
