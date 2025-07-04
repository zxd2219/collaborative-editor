import type { PixiReactElementProps } from '@pixi/react';
import type * as PIXI from 'pixi.js';

export type TextItem = PixiReactElementProps<(typeof PIXI)['Text']> & {
  type: 'text';
};
export type ContainerItem = PixiReactElementProps<
  (typeof PIXI)['Container']
> & {
  type: 'container';
  children?: Array<Item>;
};
export type SpriteItem = PixiReactElementProps<(typeof PIXI)['Sprite']> & {
  type: 'sprite';
};
export type RectangleItem = Omit<
  PixiReactElementProps<(typeof PIXI)['Graphics']>,
  'draw'
> & {
  type: 'rectangle';
};
export type CircleItem = Omit<
  PixiReactElementProps<(typeof PIXI)['Graphics']>,
  'draw'
> & {
  type: 'circle';
  radius?: number;
};
export type Item = (
  | TextItem
  | ContainerItem
  | SpriteItem
  | RectangleItem
  | CircleItem
) & { id: string };
