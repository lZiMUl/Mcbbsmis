import figlet from 'figlet';
import gradient from 'gradient-string';
import GradientFunction from '../interface/IGradientFunction';

const colors: Array<string> = [
  'red',
  'yellow',
  'green',
  'cyan',
  'blue',
  'magenta'
];

function renderAscii(
  content: string,
  charSpeed: number,
  colorSpeed: number,
  font: string
): Promise<string> {
  let frame: number = 0;
  let colorIndex: number = 0;

  const colorTimer: NodeJS.Timeout = setInterval((): void => {
    colorIndex = (colorIndex + 1) % colors.length;
  }, colorSpeed);

  return new Promise(
    async (
      resolve: (value: string | PromiseLike<string>) => void,
      reject: (reason?: any) => void
    ): Promise<void> => {
      try {
        const data: string = await figlet.text(content, { font });
        const lines: Array<string> = data?.split('\n');

        const charTimer: NodeJS.Timeout = setInterval((): void => {
          const grad: GradientFunction = gradient([
            ...colors.slice(colorIndex),
            ...colors.slice(0, colorIndex)
          ]);

          process.stdout.write('\x1B[0;0H');
          process.stdout.write(grad.multiline(lines.join('\n')));

          if (++frame > colors.length) {
            clearInterval(charTimer);
            clearInterval(colorTimer);
            resolve('');
          }
        }, charSpeed);
      } catch (error) {
        return reject(error);
      }
    }
  );
}

async function showAsciiGradient(
  text: string,
  charSpeed: number = 100,
  colorSpeed: number = 500,
  font: string = 'Slant'
): Promise<void> {
  process.stdout.write('\x1B[2J\x1B[?25l');
  const buffer: Array<string> = [];
  for (const ch of text) {
    buffer.push(ch);
    await renderAscii(buffer.join(''), charSpeed, colorSpeed, font);
  }
  process.stdout.write('\x1B[?25h\n');
}

export default showAsciiGradient;
