import { ReactNode } from 'react';
import styles from './Wrapper.module.scss';

interface WrapperProps {
  children: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  className?: string;
}

const Wrapper = ({ children, size = 'medium', className }: WrapperProps) => {
  return (
    <div className={`${styles.wrapper} ${styles[`wrapper--${size}`]} ${className || ''}`}>
      {children}
    </div>
  );
};

export default Wrapper;
