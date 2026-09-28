import React, { useEffect, useRef, useState } from 'react';

import { ArrowButton } from 'components/arrow-button';
import { Button } from 'components/button';
import { Select } from 'components/select';
import { RadioGroup } from 'components/radio-group';
import { Separator } from 'components/separator';
import { Spacing } from 'components/spacing';

import {
  ArticleStateType,
  OptionType,
  fontFamilyOptions,
  fontSizeOptions,
  fontColors,
  backgroundColors,
  contentWidthArr,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type Props = {
  initialState: ArticleStateType;             // текущее применённое (из index.tsx)
  onApply: (next: ArticleStateType) => void;  // применить
  onReset: () => void;                       // сбросить к стартовым при загрузке
};

export const ArticleParamsForm = ({ initialState, onApply, onReset }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<ArticleStateType>(initialState);

  const panelRef = useRef<HTMLElement | null>(null);

  // При открытии панели подтягиваем текущие применённые значения в форму
  useEffect(() => {
    if (isOpen) setDraft(initialState);
  }, [isOpen, initialState]);

  // Закрытие по клику вне (для всей панели, независимо от внутренних Select)
  useEffect(() => {
    if (!isOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const panel = panelRef.current;
      if (!panel) return;

      if (!panel.contains(e.target as Node)) setIsOpen(false);
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(draft);
    setIsOpen(false);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    onReset();        // применит стартовые к статье
    setIsOpen(false);
  };

  return (
    <>
      <ArrowButton isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />

      <aside
        ref={panelRef as any}
        className={`${styles.container} ${isOpen ? styles.container_open : ''}`}
      >
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
          {/* Заголовок ваш Text уже встроен в Select/RadioGroup, поэтому здесь можно без него */}
          {/* Если хотите прям как на макете — можно добавить Text, но это не обязательно */}

          <Select
            title="ШРИФТ"
            options={fontFamilyOptions}
            selected={draft.fontFamilyOption}
            onChange={(opt: OptionType) =>
              setDraft((prev) => ({ ...prev, fontFamilyOption: opt }))
            }
          />

          <Spacing size={30} />
          <Separator />
          <Spacing size={30} />

          <RadioGroup
            title="РАЗМЕР ШРИФТА"
            name="fontSize"
            options={fontSizeOptions}
            selected={draft.fontSizeOption}
            onChange={(opt: OptionType) =>
              setDraft((prev) => ({ ...prev, fontSizeOption: opt }))
            }
          />

          <Spacing size={30} />
          <Separator />
          <Spacing size={30} />

          <Select
            title="ЦВЕТ ШРИФТА"
            options={fontColors}
            selected={draft.fontColor}
            onChange={(opt: OptionType) =>
              setDraft((prev) => ({ ...prev, fontColor: opt }))
            }
          />

          <Spacing size={30} />
          <Separator />
          <Spacing size={30} />

          <Select
            title="ЦВЕТ ФОНА"
            options={backgroundColors}
            selected={draft.backgroundColor}
            onChange={(opt: OptionType) =>
              setDraft((prev) => ({ ...prev, backgroundColor: opt }))
            }
          />

          <Spacing size={30} />
          <Separator />
          <Spacing size={30} />

          <Select
            title="ШИРИНА КОНТЕНТА"
            options={contentWidthArr}
            selected={draft.contentWidth}
            onChange={(opt: OptionType) =>
              setDraft((prev) => ({ ...prev, contentWidth: opt }))
            }
          />

          <div className={styles.bottomContainer}>
            <Button title="Сбросить" type="reset" />
            <Button title="Применить" type="submit" />
          </div>
        </form>
      </aside>
    </>
  );
};
