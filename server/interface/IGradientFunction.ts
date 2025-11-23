interface GradientOptions {
  interpolation?: 'rgb' | 'hsv';
  hsvSpin?: 'short' | 'long';
}
interface GradientFunction {
  (str: string): string;
  multiline: MultiLineGradientFunction;
  (str: string, opts?: GradientOptions): string;
}
interface MultiLineGradientFunction {
  (str: string): string;
  (str: string, opts?: GradientOptions): string;
}

export default GradientFunction;
