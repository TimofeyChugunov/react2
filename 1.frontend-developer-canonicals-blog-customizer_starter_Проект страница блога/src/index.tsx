import { createRoot } from 'react-dom/client';
import { StrictMode, CSSProperties, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import { defaultArticleState, ArticleStateType } from './constants/articleProps';

import './styles/index.scss';
import styles from './styles/index.module.scss';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

const App = () => {
  // значения "как при загрузке страницы" — для кнопки "Сбросить"
  const initialStateRef = useRef<ArticleStateType>(defaultArticleState);

  // применённые значения (они реально влияют на CSS-переменные)
  const [appliedState, setAppliedState] =
    useState<ArticleStateType>(defaultArticleState);

  const cssVars = useMemo(
    () =>
      ({
        '--font-family': appliedState.fontFamilyOption.value,
        '--font-size': appliedState.fontSizeOption.value,
        '--font-color': appliedState.fontColor.value,
        '--container-width': appliedState.contentWidth.value,
        '--bg-color': appliedState.backgroundColor.value,
      } as CSSProperties),
    [appliedState]
  );

  return (
    <div className={clsx(styles.main)} style={cssVars}>
      <ArticleParamsForm
        initialState={appliedState}
        onApply={setAppliedState}
        onReset={() => setAppliedState(initialStateRef.current)}
      />
      <Article />
    </div>
  );
};

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
