type FontWeight = 'regular' | 'bold';

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

export function estimateTextWidth(
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

export function wrapTextByWords(
  text: string,
  maxWidth: number,
  fontSize: number,
  weight: FontWeight = 'regular'
): string[] {
  const normalizedText = text.trim().replace(/\s+/g, ' ');

  if (!normalizedText) {
    return [''];
  }

  const words = normalizedText.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (
      currentLine &&
      estimateTextWidth(candidate, fontSize, weight) > maxWidth
    ) {
      lines.push(currentLine);
      currentLine = word;
      continue;
    }

    currentLine = candidate;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
