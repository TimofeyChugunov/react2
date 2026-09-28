import type { Meta, StoryObj } from '@storybook/react';
import { ArrowButton } from './ArrowButton';

const meta: Meta<typeof ArrowButton> = {
  component: ArrowButton,
  title: 'Components/ArrowButton',
};
export default meta;

type Story = StoryObj<typeof ArrowButton>;

export const Closed: Story = {
  render: () => <ArrowButton isOpen={false} onClick={() => {}} />,
};

export const Open: Story = {
  render: () => <ArrowButton isOpen={true} onClick={() => {}} />,
};
