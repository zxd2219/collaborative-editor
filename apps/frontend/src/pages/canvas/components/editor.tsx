import { Application, useExtend } from '@pixi/react';
import { Viewport } from 'pixi-viewport';
import type {
  FederatedPointerEvent,
  FederatedWheelEvent,
  Application as pixiApplication,
} from 'pixi.js';
import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useKeyPress } from 'react-use';
import type { CircleItem, Item, RectangleItem } from '../types';

export interface EditorProps {
  className?: string;
  items?: Array<Item>;
}
export default function Editor(props: EditorProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<Viewport | null>(null);
  const [application, setApplication] = useState<pixiApplication | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
  const selectionBoxRef = useRef<Graphics | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastViewportPosition, setLastViewportPosition] = useState({
    x: 0,
    y: 0,
  });

  useExtend({
    Container,
    Graphics,
    Viewport,
    Sprite,
    Text,
  });

  // 添加 DOM 事件监听器来阻止默认的 Ctrl+滚轮缩放
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };

    const parentElement = parentRef.current;
    if (parentElement) {
      parentElement.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        parentElement.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  const [control] = useKeyPress('Control');
  const [shift] = useKeyPress('Shift');

  // 创建选择框
  useEffect(() => {
    if (viewport && !selectionBoxRef.current) {
      const selectionBox = new Graphics();
      viewport.addChild(selectionBox);
      selectionBoxRef.current = selectionBox;
    }
  }, [viewport]);

  // 更新选择框
  const updateSelectionBox = useCallback(() => {
    if (!selectionBoxRef.current || !isSelecting) return;

    const graphics = selectionBoxRef.current;
    graphics.clear();
    graphics.lineStyle(2, 0x0066cc, 0.8);
    graphics.beginFill(0x0066cc, 0.1);

    const width = selectionEnd.x - selectionStart.x;
    const height = selectionEnd.y - selectionStart.y;

    graphics.drawRect(selectionStart.x, selectionStart.y, width, height);
    graphics.endFill();
  }, [isSelecting, selectionStart, selectionEnd]);

  // 监听选择状态变化，更新选择框
  useEffect(() => {
    updateSelectionBox();
  }, [updateSelectionBox]);

  // 确保在组件卸载或拖拽状态改变时重置光标
  useEffect(() => {
    const element = parentRef.current;
    return () => {
      if (element) {
        element.style.cursor = 'default';
      }
    };
  }, []);

  useEffect(() => {
    if (!isDragging && parentRef.current) {
      parentRef.current.style.cursor = 'default';
    }
  }, [isDragging]);

  // 鼠标按下事件
  const handleMouseDown = (event: FederatedPointerEvent) => {
    if (!viewport) return;

    const globalPos = event.global;
    const localPos = viewport.toWorld(globalPos);

    if (event.button === 1) {
      // 中键按下，开始拖拽
      setIsDragging(true);
      setDragStart({ x: event.global.x, y: event.global.y });
      setLastViewportPosition({ x: viewport.x, y: viewport.y });

      // 设置拖拽时的光标样式
      if (parentRef.current) {
        parentRef.current.style.cursor = 'grabbing';
      }
    } else if (event.button === 0) {
      // 左键按下，开始框选
      setIsSelecting(true);
      setSelectionStart({ x: localPos.x, y: localPos.y });
      setSelectionEnd({ x: localPos.x, y: localPos.y });
    }
  };

  // 鼠标移动事件
  const handleMouseMove = (event: FederatedPointerEvent) => {
    if (!viewport) return;

    if (isDragging) {
      // 中键拖拽移动视口
      const deltaX = event.global.x - dragStart.x;
      const deltaY = event.global.y - dragStart.y;

      viewport.position.set(
        lastViewportPosition.x + deltaX,
        lastViewportPosition.y + deltaY
      );
    } else if (isSelecting) {
      // 左键框选
      const globalPos = event.global;
      const localPos = viewport.toWorld(globalPos);
      setSelectionEnd({ x: localPos.x, y: localPos.y });
    }
  };

  // 鼠标松开事件
  const handleMouseUp = (event: FederatedPointerEvent) => {
    if (event.button === 1 && isDragging) {
      // 中键松开，结束拖拽
      setIsDragging(false);

      // 恢复默认光标样式
      if (parentRef.current) {
        parentRef.current.style.cursor = 'default';
      }
    } else if (event.button === 0 && isSelecting) {
      // 左键松开，结束框选
      setIsSelecting(false);

      // 清除选择框
      if (selectionBoxRef.current) {
        selectionBoxRef.current.clear();
      }

      // 这里可以添加选择元素的逻辑
      console.log('Selection area:', { selectionStart, selectionEnd });
    }
  };

  function handleWheel(event: FederatedWheelEvent) {
    console.log('handleWheel', event, control, shift);
    if (viewport) {
      if (control) {
        // 按住 Control 键进行缩放
        const zoomDirection = event.deltaY > 0 ? -1 : 1;
        const zoomStrength = 0.1;
        const currentScale = viewport.scale.x;
        const newScale = currentScale + zoomDirection * zoomStrength;

        // 限制缩放范围
        const clampedScale = Math.max(0.1, Math.min(5, newScale));

        // 获取鼠标在视口中的世界坐标
        const mouseWorldPos = viewport.toWorld(event.global);

        // 计算缩放前后的位置差异并调整视口位置
        viewport.setZoom(clampedScale, true);
        const newWorldPos = viewport.toWorld(event.global);

        // 调整视口位置以保持鼠标位置不变
        const deltaX = mouseWorldPos.x - newWorldPos.x;
        const deltaY = mouseWorldPos.y - newWorldPos.y;
        viewport.moveCenter(
          viewport.center.x + deltaX,
          viewport.center.y + deltaY
        );
      } else if (shift) {
        const scrollAmount = event.deltaY;
        viewport.moveCenter(
          viewport.center.x + scrollAmount,
          viewport.center.y
        );
      } else {
        const scrollAmount = event.deltaY;
        viewport.moveCenter(
          viewport.center.x,
          viewport.center.y + scrollAmount
        );
      }
    }
  }

  return (
    <div className={props.className} ref={parentRef}>
      <Application
        antialias={true}
        autoDensity={true}
        backgroundAlpha={0}
        resizeTo={parentRef}
        onInit={setApplication}
      >
        {application?.renderer?.events && (
          <pixiViewport
            ref={setViewport}
            events={application.renderer.events}
            onWheel={handleWheel}
            onPointerDown={handleMouseDown}
            onPointerMove={handleMouseMove}
            onPointerUp={handleMouseUp}
            onPointerUpOutside={(event: FederatedPointerEvent) =>
              handleMouseUp(event)
            }
          >
            {props.items?.map(propsToPixiElement)}
          </pixiViewport>
        )}
      </Application>
    </div>
  );
}

function propsToPixiElement(item: Item): React.JSX.Element | null {
  switch (item.type) {
    case 'text':
      return <pixiText {...item} key={item.id} onMouseDown={console.log} />;
    case 'container':
      return (
        <pixiContainer {...item} key={item.id}>
          {item.children?.map(propsToPixiElement)}
        </pixiContainer>
      );
    case 'sprite':
      return <pixiSprite {...item} key={item.id} />;
    case 'rectangle':
      return (
        <pixiGraphics
          {...item}
          draw={createDrawRectangle(item)}
          key={item.id}
        />
      );
    case 'circle':
      return (
        <pixiGraphics {...item} draw={createDrawCircle(item)} key={item.id} />
      );
    default:
      return null;
  }
}

function createDrawRectangle(item: RectangleItem) {
  return function (graphics: Graphics) {
    graphics.clear();
    graphics.beginFill(0x3498db); // 蓝色
    graphics.drawRect(
      item.x ?? 0,
      item.y ?? 0,
      item.width ?? 100,
      item.height ?? 100
    );
    graphics.endFill();
  };
}

function createDrawCircle(item: CircleItem) {
  return function (graphics: Graphics) {
    graphics.clear();
    graphics.beginFill(0xe74c3c); // 红色
    graphics.drawCircle(item.x ?? 0, item.y ?? 0, item.radius ?? 50);
    graphics.endFill();
  };
}
