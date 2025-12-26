declare module 'opencc-js' {
  export interface ConverterOptions {
    from: 'hk' | 'tw' | 'cn' | 'jp';
    to: 'hk' | 'tw' | 'cn' | 'jp';
  }

  export interface Converter {
    (text: string): string;
  }

  export function Converter(options: ConverterOptions): Converter;
}



