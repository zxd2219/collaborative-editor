import { useState } from 'react';
import Editor from './components/editor';
import type { Item } from './types';

export default function Canvas() {
  const [items, setItems] = useState<Array<Item>>([
    {
      id: '111',
      type: 'text',
      text: 'Hello',
    },
    {
      id: '222',
      type: 'rectangle',
      x: 100,
      y: 100,
      width: 200,
      height: 100,
    },
    {
      id: '333',
      type: 'circle',
      x: 300,
      y: 300,
      radius: 50,
    },
    {
      id: '444',
      type: 'sprite',
      x: 400,
      y: 400,
      width: 100,
      height: 100,
    },
  ]);
  return (
    <section>
      <header></header>
      <main className="flex">
        <aside className="shrink-0">
          <div>
            <span>基础工具</span>
            <ul>
              <li>
                <button className="btn btn-primary">指针</button>
              </li>
              <li>
                <button className="btn btn-secondary">拖拽</button>
              </li>
            </ul>
          </div>
        </aside>
        <Editor className="flex-1" items={items} />
        <aside className="shrink-0">
          <button
            onClick={() =>
              setItems([
                {
                  id: '1',
                  type: 'text',
                  text: 'Hello, World!',
                },
              ])
            }
          >
            test
          </button>
        </aside>
      </main>
    </section>
  );
}
