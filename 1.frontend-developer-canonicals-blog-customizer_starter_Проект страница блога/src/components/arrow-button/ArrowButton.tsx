import React from 'react';
import clsx from 'clsx';
import arrow from 'src/images/arrow.svg';
import styles from './ArrowButton.module.scss';

export type ArrowButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export function ArrowButton({ isOpen, onClick }: ArrowButtonProps) {
  return (
    <div
      role="button"
      aria-label="Открыть/Закрыть форму параметров статьи"
      tabIndex={0}
      className={clsx(styles.container, { [styles.container_open]: isOpen })}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <img
        src={arrow}
        alt="иконка стрелочки"
        className={clsx(styles.arrow, { [styles.arrow_open]: isOpen })}
      />
    </div>
  );
}
